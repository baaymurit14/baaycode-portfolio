/**
 * Two things this proves:
 *
 *  A. Causality — re-introduce the pre-fix cascade (author-origin `display:flex`
 *     winning over the UA `dialog:not([open]){display:none}`) via an injected
 *     stylesheet, and confirm the stuck full-screen overlay comes back. That
 *     proves the one-line CSS fix targets the real cause, not a coincidence.
 *
 *  B. Mobile — repeat the load/open/close cycle at 375px and 768px.
 *
 * Usage: node scripts/check-causality.mjs [baseUrl]
 */

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3112";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
const check = (l, p, d = "") => {
  if (!p) failures++;
  console.log(`  [${p ? "PASS" : "FAIL"}] ${l}${d ? ` — ${d}` : ""}`);
};

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map();
    ws.addEventListener("message", (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
      }
    });
  }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => {
      ws.addEventListener("open", res, { once: true });
      ws.addEventListener("error", () => rej(new Error("ws")), { once: true });
    });
    return new CDP(ws);
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); reject(new Error(`timeout ${method}`)); }
      }, 30000);
    });
  }
  async eval(expression) {
    const r = await this.send("Runtime.evaluate", {
      expression: `(() => { ${expression} })()`, returnByValue: true, awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? "eval");
    return r.result.value;
  }
  async waitFor(expr, timeout = 45000) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      try { if (await this.eval(`return ${expr};`)) return true; } catch {}
      await sleep(400);
    }
    throw new Error(`waitFor timeout: ${expr}`);
  }
}

/**
 * Measures the things that actually decide whether the page is usable:
 * whether a closed dialog occupies the viewport and intercepts clicks.
 *
 * Note: on a `display: none` element Chrome reports UA `dialog` values for some
 * properties, so `position`/`z-index` are only meaningful once the element is
 * actually rendered. Rect + hit-testing are the reliable signals.
 */
const CLOSED_DIALOG_STATE = `
  const d = document.querySelector("dialog:not([open])");
  if (!d) return { none: true };
  const cs = getComputedStyle(d);
  const r = d.getBoundingClientRect();
  const hit = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  return {
    hasModalRootClass: d.classList.contains("modal-root"),
    display: cs.display,
    rect: [Math.round(r.width), Math.round(r.height)],
    viewport: [innerWidth, innerHeight],
    coversViewport: r.width >= innerWidth * 0.95 && r.height >= innerHeight * 0.95,
    blocksClicks: !!(hit && hit.closest("dialog")),
    // The dialog also carries a bg-transparent utility, which wins over the
    // background-color in .modal-root. So the visible symptom is the blur.
    backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter || "none",
  };
`;

/** Poll clicks until React has hydrated and the dialog actually opens. */
async function openFirstMoment(cdp, budgetMs = 90000) {
  const end = Date.now() + budgetMs;
  let clicks = 0;
  while (Date.now() < end) {
    const clicked = await cdp.eval(`
      const b = document.querySelector("#moments button[aria-label^='Agrandir']");
      if (!b) return false;
      b.scrollIntoView({ block: "center" });
      b.click();
      return true;
    `);
    if (clicked) {
      clicks++;
      for (let i = 0; i < 8; i++) {
        await sleep(300);
        if (await cdp.eval(`return !!document.querySelector("dialog[open]");`)) {
          return { opened: true, clicks };
        }
      }
    }
    await sleep(500);
  }
  return { opened: false, clicks };
}

/**
 * Refuses to judge the page unless CSS actually loaded.
 *
 * A Next dev server and `next start` share one `.next` directory; if a dev build
 * clobbers the production build while the prod server is running, the stylesheet
 * 404/500s and the page renders completely unstyled. That produces a page that
 * *looks* fine to naive checks (no overlay, clicks land) while proving nothing,
 * so treat it as a hard error instead.
 */
async function assertCssLoaded(cdp) {
  const sheets = await cdp.eval(`
    return [...document.styleSheets].map(s => {
      let n = -1; try { n = s.cssRules.length; } catch {}
      return { href: s.href || "inline", rules: n };
    });
  `);
  const total = sheets.reduce((a, s) => a + Math.max(s.rules, 0), 0);
  console.log(`  stylesheets: ${JSON.stringify(sheets)}`);
  if (total < 50) {
    throw new Error(
      `CSS did not load (${total} rules total). The server is serving a broken/` +
      `mismatched build — do NOT trust these results. Rebuild with no dev ` +
      `server running.`
    );
  }
  return sheets;
}

const userDataDir = mkdtempSync(join(tmpdir(), "cdp3-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-first-run",
  "--remote-debugging-port=9444", `--user-data-dir=${userDataDir}`,
  "--window-size=1440,900", "about:blank",
], { stdio: "ignore" });

let cdp;
try {
  let target = null;
  for (let i = 0; i < 40; i++) {
    try {
      const l = await (await fetch("http://127.0.0.1:9444/json/list")).json();
      target = l.find((t) => t.type === "page"); if (target) break;
    } catch {}
    await sleep(250);
  }
  cdp = await CDP.connect(target.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  /* ---------- A. causality ---------- */
  console.log("\nA. CAUSALITY — is the CSS cascade the real cause?");

  await cdp.send("Page.navigate", { url: `${BASE}/` });
  await cdp.waitFor(`document.querySelectorAll("#moments button").length > 0`);
  await sleep(1500);
  await assertCssLoaded(cdp);

  const fixed = await cdp.eval(CLOSED_DIALOG_STATE);
  console.log(`  shipped state:    ${JSON.stringify(fixed)}`);
  check("the dialog carries the .modal-root class", fixed.hasModalRootClass === true);
  check("with the fix, a closed dialog is display:none", fixed.display === "none");
  check("with the fix, a closed dialog covers nothing", fixed.coversViewport === false);
  check("with the fix, a closed dialog blocks no clicks", fixed.blocksClicks === false);

  // Re-introduce the pre-fix cascade: author-origin display:flex on the closed dialog.
  await cdp.eval(`
    const s = document.createElement("style");
    s.id = "prefix-sim";
    s.textContent = ".modal-root:not([open]) { display: flex !important; }";
    document.head.appendChild(s);
    return true;
  `);
  await sleep(600);
  const broken = await cdp.eval(CLOSED_DIALOG_STATE);
  console.log(`  simulated pre-fix: ${JSON.stringify(broken)}`);
  check("without the fix the author display:flex wins over the UA rule",
    broken.display === "flex");
  check("without the fix it covers the whole viewport", broken.coversViewport === true,
    `${JSON.stringify(broken.rect)} of ${JSON.stringify(broken.viewport)}`);
  check("without the fix it intercepts clicks", broken.blocksClicks === true);
  check("without the fix it paints the full-screen blur",
    /blur\(12px\)/.test(broken.backdropFilter || ""),
    `backdrop-filter=${broken.backdropFilter}`);

  await cdp.eval(`document.getElementById("prefix-sim")?.remove(); return true;`);
  await sleep(400);
  const restored = await cdp.eval(CLOSED_DIALOG_STATE);
  check("removing the simulated regression restores the fix", restored.display === "none");

  /* ---------- B. viewports ---------- */
  for (const [w, h, label] of [[375, 812, "iPhone X 375"], [768, 1024, "tablet 768"], [1920, 1080, "desktop 1920"]]) {
    console.log(`\nB. VIEWPORT ${label}`);
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: w, height: h, deviceScaleFactor: 1, mobile: w < 768,
    });
    await cdp.send("Page.navigate", { url: `${BASE}/` });
    await cdp.waitFor(`document.querySelectorAll("#moments button").length > 0`);
    await sleep(1500);

    const st = await cdp.eval(CLOSED_DIALOG_STATE);
    check(`${label}: no overlay on load`, st.display === "none" && !st.coversViewport,
      `display=${st.display} rect=${JSON.stringify(st.rect)}`);
    check(`${label}: page clickable on load`, st.blocksClicks === false);

    // open → close
    const o = await openFirstMoment(cdp);
    check(`${label}: modal opens`, o.opened, JSON.stringify(o));

    await cdp.eval(`
      const d = document.querySelector("dialog[open]");
      if (!d) return false;
      const b = [...d.querySelectorAll("button")].find(x =>
        (x.getAttribute("aria-label")||"").toLowerCase().includes("fermer"));
      if (!b) return false;
      b.click();
      return true;
    `);
    await sleep(1000);
    const after = await cdp.eval(CLOSED_DIALOG_STATE);
    check(`${label}: modal closes and page is usable`,
      after.display === "none" && after.blocksClicks === false,
      `display=${after.display} blocks=${after.blocksClicks}`);

    // no horizontal overflow
    const overflow = await cdp.eval(
      `return document.documentElement.scrollWidth - document.documentElement.clientWidth;`
    );
    check(`${label}: no horizontal overflow`, overflow <= 1, `${overflow}px`);
  }
} catch (e) {
  failures++;
  console.error(`\nRUNNER ERROR: ${e.message}`);
} finally {
  try { cdp?.ws.close(); } catch {}
  chrome.kill();
  try { rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch {}
}

console.log(failures === 0 ? "\nALL CHECKS PASSED\n" : `\n${failures} CHECK(S) FAILED\n`);
process.exit(failures === 0 ? 0 : 1);
