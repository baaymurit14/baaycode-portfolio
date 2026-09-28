/**
 * Dependency-free overlay regression check.
 *
 * Drives a real Chrome over the DevTools Protocol (Node 24's global WebSocket)
 * and asserts the behaviours the overlay bug broke:
 *   1. no overlay on load
 *   2. the page is fully clickable on load
 *   3. opening an image shows exactly one modal
 *   4. the X button closes it
 *   5. Escape closes it
 *   6. a backdrop click closes it
 *   7. the page is clickable again after every close
 *   8. no stray fixed/blur layer is left in the DOM
 *
 * Usage: node scripts/check-overlay.mjs [baseUrl]
 */

const BASE = process.argv[2] ?? "http://localhost:3111";
const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ *
 * Minimal CDP client
 * ------------------------------------------------------------------ */

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    });
  }

  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => {
      ws.addEventListener("open", res, { once: true });
      ws.addEventListener("error", () => rej(new Error("ws failed")), { once: true });
    });
    return new CDP(ws);
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`timeout: ${method}`));
        }
      }, 30000);
    });
  }

  /** Evaluate an expression in the page and return its JSON value. */
  async eval(expression) {
    const r = await this.send("Runtime.evaluate", {
      expression: `(() => { ${expression} })()`,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.exception?.description ?? "eval failed");
    }
    return r.result.value;
  }

  /**
   * Poll until an expression returns truthy. The dev server compiles routes on
   * demand, so a fixed sleep is not a reliable readiness signal.
   */
  async waitFor(expression, { timeout = 45000, label = expression } = {}) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      try {
        if (await this.eval(`return ${expression};`)) return true;
      } catch {}
      await new Promise((r) => setTimeout(r, 400));
    }
    throw new Error(`waitFor timed out: ${label}`);
  }
}

/* ------------------------------------------------------------------ *
 * Assertions
 * ------------------------------------------------------------------ */

let failures = 0;
function check(label, pass, detail = "") {
  const mark = pass ? "PASS" : "FAIL";
  if (!pass) failures++;
  console.log(`  [${mark}] ${label}${detail ? ` — ${detail}` : ""}`);
}

/**
 * Injected into the page: describes every dialog and any element that could be
 * acting as a stuck full-screen overlay.
 */
const OVERLAY_PROBE = `
  const out = { dialogs: [], blockers: [] };
  for (const d of document.querySelectorAll("dialog")) {
    const cs = getComputedStyle(d);
    const r = d.getBoundingClientRect();
    out.dialogs.push({
      open: d.hasAttribute("open"),
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      zIndex: cs.zIndex,
      position: cs.position,
      pointerEvents: cs.pointerEvents,
      coversViewport:
        r.width >= innerWidth * 0.95 && r.height >= innerHeight * 0.95,
      rect: [Math.round(r.width), Math.round(r.height)],
    });
  }
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
    if (parseFloat(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < innerWidth * 0.9 || r.height < innerHeight * 0.9) continue;
    if (el.closest("dialog")) continue;               // a real open modal is fine
    if (el.getAttribute("aria-hidden") === "true") continue; // decorative layers
    out.blockers.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 70),
      zIndex: cs.zIndex,
      pointerEvents: cs.pointerEvents,
      opacity: cs.opacity,
      backdropFilter: cs.backdropFilter,
    });
  }
  return out;
`;

/** Does a click at the centre of the page reach the page content? */
const CLICK_PROBE = `
  const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  const dlg = el && el.closest("dialog");
  return {
    tag: el ? el.tagName.toLowerCase() : null,
    insideOpenDialog: !!(dlg && dlg.hasAttribute("open")),
    section: el ? (el.closest("section")?.id || "") : "",
  };
`;

/* ------------------------------------------------------------------ *
 * Interaction helpers
 * ------------------------------------------------------------------ */

/**
 * Click a trigger and wait for the dialog to actually open.
 *
 * React attaches its delegated listeners during hydration, which in dev mode
 * finishes well after the server HTML is on screen. A bare `element.click()` on
 * not-yet-hydrated markup silently does nothing, so retry until the handler
 * responds — this also proves the real user flow once hydration completes.
 */
async function openViaCdp(cdp, triggerSelector) {
  for (let attempt = 0; attempt < 25; attempt++) {
    const clicked = await cdp.eval(`
      const b = document.querySelector(${JSON.stringify(triggerSelector)});
      if (!b) return false;
      b.click();
      return true;
    `);
    if (clicked) {
      for (let i = 0; i < 10; i++) {
        await sleep(300);
        if (await cdp.eval(`return !!document.querySelector("dialog[open]");`)) {
          return { opened: true, attempts: attempt + 1 };
        }
      }
    }
    await sleep(500);
  }
  return { opened: false, attempts: 25 };
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

const userDataDir = mkdtempSync(join(tmpdir(), "cdp-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9222",
    `--user-data-dir=${userDataDir}`,
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" }
);

let cdp;
try {
  // Wait for the debugging endpoint.
  let target = null;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json/list");
      const list = await res.json();
      target = list.find((t) => t.type === "page");
      if (target) break;
    } catch {}
    await sleep(250);
  }
  if (!target) throw new Error("Chrome did not expose a page target");

  cdp = await CDP.connect(target.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("DOM.enable");

  /* --- 1. initial load ------------------------------------------- */
  console.log(`\n1. INITIAL LOAD — ${BASE}/`);
  await cdp.send("Page.navigate", { url: `${BASE}/` });
  await cdp.waitFor(
    `document.querySelectorAll("#moments button[aria-label^='Agrandir']").length > 0`,
    { label: "moments gallery hydrated" }
  );
  await sleep(1200);

  let state = await cdp.eval(OVERLAY_PROBE);
  const closedVisible = state.dialogs.filter(
    (d) => !d.open && d.display !== "none"
  );
  check("no dialog rendered when closed", closedVisible.length === 0,
    JSON.stringify(closedVisible));
  check("no full-screen blocker element", state.blockers.length === 0,
    JSON.stringify(state.blockers));
  check("page is scrollable", await cdp.eval(`return document.body.scrollHeight > innerHeight;`));

  /* --- 2. page is clickable on load ------------------------------- */
  let hit = await cdp.eval(CLICK_PROBE);
  check("click at viewport centre reaches page content", !hit.insideOpenDialog,
    `hit <${hit.tag}> in section "${hit.section}"`);

  /* --- 3. open an image ------------------------------------------ */
  console.log(`\n2. OPENING A MOMENT`);
  const trigger = "#moments button[aria-label^='Agrandir']";
  const triggerCount = await cdp.eval(
    `return document.querySelectorAll(${JSON.stringify(trigger)}).length;`
  );
  check("moment triggers are present", triggerCount > 0, `found ${triggerCount}`);
  const opened = await openViaCdp(cdp, trigger);
  check("clicking a moment opens its dialog", opened.opened, JSON.stringify(opened));
  await sleep(600);

  state = await cdp.eval(OVERLAY_PROBE);
  const openDialogs = state.dialogs.filter((d) => d.open);
  check("exactly one dialog is open", openDialogs.length === 1,
    `open=${openDialogs.length}`);
  check("the open dialog is displayed", openDialogs[0]?.display !== "none",
    `display=${openDialogs[0]?.display}`);
  check("the open dialog covers the viewport", !!openDialogs[0]?.coversViewport,
    `rect=${JSON.stringify(openDialogs[0]?.rect)}`);
  const imageInModal = await cdp.eval(`
    const d = document.querySelector("dialog[open]");
    return !!d && !!d.querySelector("img");
  `);
  check("the modal shows the photograph", imageInModal);

  /* --- 4. close with the X button -------------------------------- */
  console.log(`\n3. CLOSING WITH THE X BUTTON`);
  const xClosed = await cdp.eval(`
    const d = document.querySelector("dialog[open]");
    if (!d) return "no open dialog";
    const b = [...d.querySelectorAll("button")].find(x =>
      (x.getAttribute("aria-label") || "").toLowerCase().includes("fermer"));
    if (!b) return "no close button";
    b.click();
    return "clicked";
  `);
  check("the X button was found and clicked", xClosed === "clicked", String(xClosed));
  await sleep(900);
  state = await cdp.eval(OVERLAY_PROBE);
  check("X closes the modal", state.dialogs.every((d) => !d.open),
    JSON.stringify(state.dialogs.map((d) => d.open)));
  hit = await cdp.eval(CLICK_PROBE);
  check("page clickable again after X", !hit.insideOpenDialog, `hit <${hit.tag}>`);

  /* --- 5. Escape -------------------------------------------------- */
  console.log(`\n4. ESCAPE KEY`);
  check("reopened for the Escape test", (await openViaCdp(cdp, trigger)).opened);
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27,
  });
  await cdp.send("Input.dispatchKeyEvent", {
    type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27,
  });
  await sleep(900);
  state = await cdp.eval(OVERLAY_PROBE);
  check("Escape closes the modal", state.dialogs.every((d) => !d.open),
    JSON.stringify(state.dialogs.map((d) => d.open)));
  hit = await cdp.eval(CLICK_PROBE);
  check("page clickable again after Escape", !hit.insideOpenDialog, `hit <${hit.tag}>`);

  /* --- 6. backdrop click ------------------------------------------ */
  console.log(`\n5. BACKDROP CLICK`);
  check("reopened for the backdrop test", (await openViaCdp(cdp, trigger)).opened);
  const box = await cdp.eval(`
    const d = document.querySelector("dialog[open]");
    if (!d) return null;
    const r = d.getBoundingClientRect();
    return { x: Math.round(r.left + 6), y: Math.round(r.top + 6) };
  `);
  check("dialog has a backdrop area to click", !!box, JSON.stringify(box));
  for (const type of ["mousePressed", "mouseReleased"]) {
    await cdp.send("Input.dispatchMouseEvent", {
      type, x: box.x, y: box.y, button: "left", clickCount: 1,
    });
  }
  await sleep(900);
  state = await cdp.eval(OVERLAY_PROBE);
  check("backdrop click closes the modal", state.dialogs.every((d) => !d.open),
    JSON.stringify(state.dialogs.map((d) => d.open)));
  hit = await cdp.eval(CLICK_PROBE);
  check("page clickable again after backdrop click", !hit.insideOpenDialog, `hit <${hit.tag}>`);

  /* --- 7. recognition document viewer ---------------------------- */
  console.log(`\n6. RECOGNITION DOCUMENT VIEWER`);
  await cdp.eval(`document.getElementById("recognition").scrollIntoView();`);
  await sleep(600);
  const docTrigger = "#recognition button[aria-label^='Agrandir le document']";
  const docOpened = await openViaCdp(cdp, docTrigger);
  check("a certificate opens in the document viewer", docOpened.opened, JSON.stringify(docOpened));
  state = await cdp.eval(OVERLAY_PROBE);
  check("document viewer opens", state.dialogs.some((d) => d.open));
  await cdp.eval(`
    const d = document.querySelector("dialog[open]");
    const b = [...d.querySelectorAll("button")].find(x =>
      (x.getAttribute("aria-label") || "").toLowerCase().includes("fermer"));
    if (b) b.click();
  `);
  await sleep(800);
  state = await cdp.eval(OVERLAY_PROBE);
  check("document viewer closes", state.dialogs.every((d) => !d.open));
  hit = await cdp.eval(CLICK_PROBE);
  check("page clickable after closing the document viewer", !hit.insideOpenDialog);

  /* --- 8. no stray layers ----------------------------------------- */
  console.log(`\n7. FINAL STATE`);
  state = await cdp.eval(OVERLAY_PROBE);
  check("no dialog is left open", state.dialogs.every((d) => !d.open));
  check("no full-screen blocker remains", state.blockers.length === 0,
    JSON.stringify(state.blockers));
  const stillClickable = await cdp.eval(`
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return !!el && !el.closest("dialog");
  `);
  check("page fully interactive at the end", stillClickable);
} catch (err) {
  failures++;
  console.error(`\nRUNNER ERROR: ${err.message}`);
} finally {
  try { cdp?.ws.close(); } catch {}
  chrome.kill();
  // Windows can still hold the profile briefly after the process exits.
  try { rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch {}
}

console.log(
  failures === 0
    ? "\nALL CHECKS PASSED\n"
    : `\n${failures} CHECK(S) FAILED\n`
);
process.exit(failures === 0 ? 0 : 1);
