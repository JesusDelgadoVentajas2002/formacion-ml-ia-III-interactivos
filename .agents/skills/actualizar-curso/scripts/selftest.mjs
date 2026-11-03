// Prueba la web en Chrome sin interfaz. Uso:
//   node selftest.mjs <raíz-web> <carpeta-trabajo>                       → comprueba todas las páginas
//   node selftest.mjs <raíz-web> <carpeta-trabajo> shot <página> <id> [dark] → captura solo ese elemento (fig-N, tab-N, ej-m9-1…)
// Comprobaciones:
//   · ninguna página lanza errores de JavaScript;
//   · todas las figuras interactivas arrancan (ninguna queda en «Figura no disponible» o «Error al cargar»);
//   · laboratorio: sin tocar nada la nota es 0 y, aplicando la solución de cada ejercicio, cada uno saca 10.
// En modo sin interfaz Chrome apenas emite requestAnimationFrame: la página de prueba lo sustituye por setTimeout.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [site, work, mode, page, target, theme] = process.argv.slice(2);
if (!site || !work) { console.error("uso: node selftest.mjs <raíz-web> <carpeta-trabajo> [shot <página> <id> [dark]]"); process.exit(1); }
fs.mkdirSync(path.join(work, "prof"), { recursive: true });
const CHROME = [process.env.CHROME, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(p => p && fs.existsSync(p));
if (!CHROME) { console.error("No encuentro Chrome. Indica su ruta con la variable de entorno CHROME."); process.exit(1); }
const root = path.resolve(site).replace(/\\/g, "/");
const url = p => "file:///" + path.resolve(p).replace(/\\/g, "/");

function harness(rel, probe, name) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  const base = `file:///${root}/${path.dirname(rel) === "." ? "" : path.dirname(rel) + "/"}`;
  const pre = `<base href="${base}"><script>window.__errs=[];addEventListener("error",e=>__errs.push(e.message+" @"+(e.filename||"").split("/").pop()+":"+e.lineno));window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()),16);window.cancelAnimationFrame=clearTimeout;${theme === "dark" ? 'localStorage.setItem("m8-theme","dark");' : 'localStorage.setItem("m8-theme","light");'}</script>`;
  const f = path.join(work, name);
  fs.writeFileSync(f, html.replace("<head>", "<head>" + pre).replace("</body>", `<script>${probe}</script></body>`));
  return f;
}
function chrome(args) { try { return execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run", `--user-data-dir=${path.join(work, "prof")}`, "--allow-file-access-from-files", "--hide-scrollbars", ...args], { encoding: "utf8", maxBuffer: 64e6, timeout: 240000, stdio: ["ignore", "pipe", "ignore"] }); } catch (e) { return e.stdout || ""; } }
const OUT = `const pre=document.createElement("pre");pre.id="OUT";pre.textContent=JSON.stringify(R);document.body.appendChild(pre)`;
const read = dom => { const m = dom.match(/<pre id="OUT">([\s\S]*?)<\/pre>/); return m ? JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")) : null; };

if (mode === "shot") {
  const probe = `const id=${JSON.stringify(target)};setTimeout(()=>{const el=document.getElementById(id)||document.querySelector('[data-ej="'+id.replace(/^ej-/,"")+'"]');const keep=el&&(el.closest("section.ej")||el.closest("figure")||el.closest(".table-block")||el);
    const st=document.createElement("style");st.textContent=".topbar,.sidebar,.progress,.ej-bar,footer,.totop{display:none!important}.layout{display:block;padding:0}main.content{padding:16px}";document.head.appendChild(st);
    if(keep){const art=keep.closest("article")||document.body;[...art.children].forEach(c=>{if(!c.contains(keep))c.style.display="none"});keep.style.margin="0 auto";window.scrollTo(0,0)}},0);`;
  const f = harness(page, probe, "shot.html"), png = path.join(work, `shot-${target}${theme === "dark" ? "-dark" : ""}.png`);
  chrome(["--window-size=1280,1000", "--virtual-time-budget=8000", `--screenshot=${png}`, url(f)]);
  console.log(png); process.exit(0);
}

let fail = 0;
const pages = ["index.html", "curso/index.html", ...fs.readdirSync(path.join(site, "curso")).filter(f => /^modulo-\d+\.html$/.test(f)).map(f => "curso/" + f)];
for (const rel of pages) {
  const isLab = rel === "index.html";
  const probe = isLab
    ? `(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const R={};await w(800);__bootAll();await w(800);
        document.getElementById("ejGrade").click();R.nota0=document.querySelector(".nota span").textContent;document.getElementById("ejModal").hidden=true;
        for(const s of document.querySelectorAll("section.ej")){s.scrollIntoView();await w(200);const b=s.querySelector(".fb-sol button");if(b)b.click();await w(4500)}
        document.getElementById("ejGrade").click();R.nota1=document.querySelector(".nota span").textContent;
        R.ej=[...document.querySelectorAll("section.ej")].map(s=>[s.dataset.ej,(s.querySelector(".fb-score")||{textContent:"?"}).textContent.replace(/\\s/g,"")]);
        R.broken=[...document.querySelectorAll(".ifig .loading")].map(l=>(l.closest("[data-w]")||{}).dataset?.w+": "+l.textContent);R.errs=__errs;${OUT}})()`
    : `(async()=>{const w=ms=>new Promise(r=>setTimeout(r,ms));const R={};await w(800);window.__bootAll&&__bootAll();await w(3000);
        R.figs=document.querySelectorAll(".ifig").length;R.broken=[...document.querySelectorAll(".ifig .loading")].map(l=>(l.closest("[data-w]")||{}).dataset?.w+": "+l.textContent);
        R.deadLinks=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute("href").slice(1)).filter(id=>id&&!document.getElementById(id));R.errs=__errs;${OUT}})()`;
  const f = harness(rel, probe, "t-" + rel.replace(/\//g, "_"));
  const R = read(chrome(["--window-size=1400,1000", `--virtual-time-budget=${isLab ? 120000 : 20000}`, "--dump-dom", url(f)]));
  if (!R) { console.log(`✗ ${rel}: la prueba no terminó`); fail++; continue; }
  const probs = [...R.errs.map(e => "error JS: " + e), ...R.broken.map(b => "figura rota: " + b), ...(R.deadLinks || []).map(d => "enlace interno roto: #" + d)];
  if (isLab) { if (R.nota0 !== "0") probs.push(`sin tocar nada la nota es ${R.nota0}, no 0`); R.ej.filter(([, s]) => s !== "10/10").forEach(([id, s]) => probs.push(`la solución de ${id} saca ${s}`)); }
  fail += probs.length;
  console.log(`${probs.length ? "✗" : "✓"} ${rel}${isLab ? ` · ${R.ej.length} ejercicios · nota sin tocar ${R.nota0} · con soluciones ${R.nota1}` : ` · ${R.figs} figuras`}`);
  probs.forEach(p => console.log("   - " + p));
}
process.exit(fail ? 1 : 0);
