import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const BASE = process.argv[2] ?? "http://localhost:3112";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dir = mkdtempSync(join(tmpdir(), "cdpD-"));
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ["--headless=new","--disable-gpu","--no-first-run","--remote-debugging-port=9555",
   `--user-data-dir=${dir}`,"about:blank"], { stdio: "ignore" });
let t=null;
for (let i=0;i<40;i++){ try{ const l=await (await fetch("http://127.0.0.1:9555/json/list")).json(); t=l.find(x=>x.type==="page"); if(t)break;}catch{} await sleep(250);}
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener("open",r,{once:true}));
let id=0; const pend=new Map();
ws.addEventListener("message",e=>{const m=JSON.parse(e.data); if(m.id&&pend.has(m.id)){pend.get(m.id)(m); pend.delete(m.id);}});
const send=(method,params={})=>{const i=++id; ws.send(JSON.stringify({id:i,method,params})); return new Promise(r=>pend.set(i,r));};
const ev=async(expr)=>{const r=await send("Runtime.evaluate",{expression:`(()=>{${expr}})()`,returnByValue:true,awaitPromise:true});
  if(r.result?.exceptionDetails) return "ERR "+JSON.stringify(r.result.exceptionDetails).slice(0,300);
  return r.result?.result?.value;};
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride",{width:375,height:812,deviceScaleFactor:1,mobile:true});
await send("Page.navigate",{url:BASE+"/"});
await sleep(9000);

console.log("=== A. which CSS rules match the closed dialog? ===");
console.log(await ev(`
  const d = document.querySelector("dialog:not([open])");
  const out = { className: d ? d.className : null, matched: [] };
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) {
      if (!r.selectorText) continue;
      if (!/modal-root/.test(r.selectorText)) continue;
      out.matched.push({ sel: r.selectorText, css: r.style.cssText.slice(0,260) });
    }
  }
  return out;
`));

console.log("\n=== B. stylesheets actually loaded ===");
console.log(await ev(`
  return [...document.styleSheets].map(s => {
    let n = -1; try { n = s.cssRules.length; } catch {}
    return (s.href||"inline") + "  rules=" + n;
  });
`));

console.log("\n=== C. horizontal overflow at 375 ===");
console.log(await ev(`
  const vw = document.documentElement.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      bad.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className||"").toString().slice(0,80),
        left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
        pos: getComputedStyle(el).position,
      });
    }
  }
  return { vw, scrollW: document.documentElement.scrollWidth, count: bad.length, first: bad.slice(0,12) };
`));

ws.close(); chrome.kill();
try { rmSync(dir,{recursive:true,force:true,maxRetries:5,retryDelay:300}); } catch {}