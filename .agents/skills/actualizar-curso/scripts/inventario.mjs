// Inventario Word ↔ web. Uso:
//   node inventario.mjs <docx> <raíz-web> <carpeta-salida> [copia-anterior-word.md]
// Con la copia anterior, añade los cambios del Word desde la última sincronización.
// Escribe en la carpeta de salida:
//   word.md        el Word en texto plano marcado (títulos, párrafos, listas, tablas, $fórmulas$, ![imágenes])
//   web.md         lo mismo para curso/modulo-*.html
//   media/         las imágenes del Word
//   omml/eq-N.xml  cada fórmula del Word en su XML original (para pasarla a LaTeX con fidelidad)
//   inventario.md  comparación apartado a apartado: nuevos, desaparecidos y modificados (con similitud)
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const [docx, site, out, prev] = process.argv.slice(2);
if (!docx || !site || !out) { console.error("uso: node inventario.mjs <docx> <raíz-web> <salida>"); process.exit(1); }
fs.mkdirSync(path.join(out, "media"), { recursive: true });
fs.mkdirSync(path.join(out, "omml"), { recursive: true });

// ---------------------------------------------------------------- zip mínimo (sin dependencias)
function unzip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  const n = buf.readUInt16LE(eocd + 10), cd = buf.readUInt32LE(eocd + 16), files = {};
  for (let i = 0, p = cd; i < n; i++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), el = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), lo = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nl);
    const ds = lo + 30 + buf.readUInt16LE(lo + 26) + buf.readUInt16LE(lo + 28), raw = buf.subarray(ds, ds + csize);
    files[name] = () => (method === 8 ? zlib.inflateRawSync(raw) : raw);
    p += 46 + nl + el + cl;
  }
  return files;
}
const ent = s => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&");

// ---------------------------------------------------------------- Word → word.md
const Z = unzip(fs.readFileSync(docx));
const xml = Z["word/document.xml"]().toString("utf8");
const rels = {};
for (const m of Z["word/_rels/document.xml.rels"]().toString("utf8").matchAll(/<Relationship [^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)) rels[m[1]] = m[2];
let eqN = 0;
function mathText(x) { return ent([...x.matchAll(/<m:t(?:\s[^>]*)?>([^<]*)<\/m:t>/g)].map(m => m[1]).join("")).trim(); }
function inline(px) {
  let s = "";
  const re = /<m:oMathPara\b[\s\S]*?<\/m:oMathPara>|<m:oMath\b[\s\S]*?<\/m:oMath>|<w:r\b[\s\S]*?<\/w:r>/g;
  for (const m of px.matchAll(re)) {
    const t = m[0];
    if (t.startsWith("<m:")) { eqN++; fs.writeFileSync(path.join(out, "omml", `eq-${eqN}.xml`), t); const d = t.startsWith("<m:oMathPara"); s += d ? `\n$$${mathText(t)}$$ {eq-${eqN}}\n` : `$${mathText(t)}$ {eq-${eqN}}`; continue; }
    const img = t.match(/r:embed="([^"]+)"/);
    if (img) { const target = rels[img[1]] || "?"; s += ` ![](${target}) `; continue; }
    let txt = "";
    for (const r of t.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\/>|<w:br\/>/g)) txt += r[1] !== undefined ? ent(r[1]) : r[0] === "<w:tab/>" ? "\t" : "\n";
    if (!txt) continue;
    const rpr = (t.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/) || [])[1] || "";
    const b = /<w:b(?:\s+w:val="(?:1|true)")?\/>/.test(rpr), i = /<w:i(?:\s+w:val="(?:1|true)")?\/>/.test(rpr);
    s += b && txt.trim() ? `**${txt}**` : i && txt.trim() ? `*${txt}*` : txt;
  }
  return s.replace(/\*\*\*\*/g, "").replace(/\s+\n/g, "\n");
}
function para(px) {
  const st = (px.match(/<w:pStyle w:val="([^"]+)"/) || [])[1] || "";
  const t = inline(px).trim();
  const h = st.match(/^(?:Heading|Ttulo|Título)(\d)$/i);
  if (h) return t ? `${"#".repeat(+h[1])} ${t.replace(/\*+/g, "")}` : "";
  if (/caption|descripci/i.test(st)) return t ? `> ${t}` : "";
  if (/<w:numPr>/.test(px)) return t ? `- ${t}` : "";
  return t;
}
function table(tx) {
  const rows = [...tx.matchAll(/<w:tr\b[\s\S]*?<\/w:tr>/g)].map(r => [...r[0].matchAll(/<w:tc\b[\s\S]*?<\/w:tc>/g)].map(c => [...c[0].matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map(p => para(p[0])).filter(Boolean).join(" / ").replace(/\|/g, "\\|")));
  if (!rows.length) return "";
  return [`| ${rows[0].join(" | ")} |`, `|${rows[0].map(() => "---").join("|")}|`, ...rows.slice(1).map(r => `| ${r.join(" | ")} |`)].join("\n");
}
// recorre los hijos directos de <w:body>: párrafos y tablas (con anidamiento)
const body = xml.slice(xml.indexOf("<w:body>") + 8, xml.lastIndexOf("</w:body>"));
const blocks = [];
for (let i = 0; i < body.length;) {
  const p = body.indexOf("<w:p", i), tb = body.indexOf("<w:tbl>", i);
  const nextP = (() => { let k = p; while (k >= 0 && !/^<w:p[\s>]/.test(body.slice(k, k + 5))) k = body.indexOf("<w:p", k + 1); return k; })();
  if (nextP < 0 && tb < 0) break;
  if (tb >= 0 && (nextP < 0 || tb < nextP)) {
    let depth = 0, k = tb;
    const re = /<w:tbl>|<\/w:tbl>/g; re.lastIndex = tb; let m;
    while ((m = re.exec(body))) { depth += m[0] === "<w:tbl>" ? 1 : -1; if (depth === 0) { k = re.lastIndex; break; } }
    blocks.push(table(body.slice(tb, k))); i = k;
  } else {
    const end = body.indexOf("</w:p>", nextP); const self = body.indexOf("/>", nextP);
    if (self >= 0 && self < body.indexOf(">", nextP) + 1 && (end < 0 || self < end)) { i = self + 2; continue; }
    blocks.push(para(body.slice(nextP, end + 6))); i = end + 6;
  }
}
const wordMd = blocks.filter(Boolean).join("\n\n");
fs.writeFileSync(path.join(out, "word.md"), wordMd);
for (const k of Object.keys(Z)) if (k.startsWith("word/media/")) fs.writeFileSync(path.join(out, "media", path.basename(k)), Z[k]());

// ---------------------------------------------------------------- web → web.md
const strip = h => ent(h.replace(/<a class="anchor"[\s\S]*?<\/a>/g, "").replace(/<span class="katex"[\s\S]*?<\/span><\/span><\/span>(?=[^<]*<)/g, "$·$").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const mods = fs.readdirSync(path.join(site, "curso")).filter(f => /^modulo-\d+\.html$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)));
let webMd = "";
for (const f of mods) {
  const h = fs.readFileSync(path.join(site, "curso", f), "utf8");
  const art = h.slice(h.indexOf('<article class="article">'), h.indexOf("</article>"));
  const title = strip((art.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || f);
  webMd += `\n\n# ${title}  {${f}}\n`;
  const re = /<h([234])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>|<p(?: class="([^"]*)")?>([\s\S]*?)<\/p>|<li>([\s\S]*?)<\/li>|<figcaption>([\s\S]*?)<\/figcaption>|<div class="ifig" data-w="([^"]+)"|<div class="eq">/g;
  for (const m of art.matchAll(re)) {
    if (m[1]) webMd += `\n${"#".repeat(+m[1])} ${strip(m[3])}  {#${m[2]}}\n`;
    else if (m[5] !== undefined) { const t = strip(m[5]); if (t) webMd += m[4] === "tcap" ? `\n> ${t}\n` : `\n${t}\n`; }
    else if (m[6] !== undefined) webMd += `- ${strip(m[6])}\n`;
    else if (m[7] !== undefined) webMd += `\n> ${strip(m[7])}\n`;
    else if (m[8]) webMd += `\n[figura interactiva: ${m[8]}]\n`;
    else webMd += `\n$$·$$\n`;
  }
}
fs.writeFileSync(path.join(out, "web.md"), webMd.trim());

// ---------------------------------------------------------------- comparación por apartados
const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\{[^}]*\}/g, "").replace(/^(modulo\s+\d+\.?|\d+(\.\d+)*\.?)\s*/, "").replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
function sections(md, isWord) {
  const S = []; let mod = "", cur = null; const trail = [];
  for (const line of md.split("\n")) {
    const h = line.match(/^(#{1,4}) (.*)$/);
    if (h) {
      const lv = h[1].length, raw = h[2];
      if (lv === 1) { const m = raw.match(/M[oó]dulo\s+(\d+)/i); if (!m) { cur = null; continue; } mod = m[1]; }
      trail.length = lv - 1; trail[lv - 1] = norm(raw);   // la clave lleva la ruta de títulos: dos «Cómo se combate» en apartados distintos no se mezclan
      cur = { mod, lv, title: raw.replace(/\s*\{[^}]*\}\s*$/, ""), key: mod + "|" + trail.slice(1).join(" › "), text: "", figs: 0, tabs: 0, eqs: 0 };
      S.push(cur); continue;
    }
    if (!cur || !mod) continue;
    if (isWord ? /!\[\]\(/.test(line) : /^\[figura interactiva/.test(line)) cur.figs += (line.match(isWord ? /!\[\]\(/g : /figura interactiva/g) || []).length;
    if (/^\|---/.test(line) || /^> Tabla/.test(line)) cur.tabs += isWord ? (/^\|---/.test(line) ? 1 : 0) : 1;
    if (/\$\$/.test(line)) cur.eqs++;
    cur.text += " " + line.replace(/^> /, "").replace(/!\[\]\([^)]*\)|\$[^$]*\$|\{eq-\d+\}|\[[^\]]*\]|[*#|-]/g, " ");
  }
  return S;
}
const W = sections(wordMd, true), B = sections(webMd, false), BK = new Map(B.map(s => [s.key, s])), WK = new Set(W.map(s => s.key));
const words = t => norm(t).split(" ").filter(w => w.length > 2);
function sim(a, b) { const A = words(a), Bw = words(b); if (!A.length && !Bw.length) return 1; const big = x => { const m = new Map(); for (let i = 0; i < x.length - 1; i++) { const k = x[i] + " " + x[i + 1]; m.set(k, (m.get(k) || 0) + 1); } return m; }; const ma = big(A), mb = big(Bw); let inter = 0, na = 0, nb = 0; for (const v of ma.values()) na += v; for (const v of mb.values()) nb += v; for (const [k, v] of ma) inter += Math.min(v, mb.get(k) || 0); return na + nb ? (2 * inter) / (na + nb) : 1; }
const pad = s => "  ".repeat(Math.max(0, s.lv - 1));
let rep = `# Inventario Word ↔ web\n\nWord: ${path.basename(docx)} · ${W.length} títulos · ${eqN} fórmulas · ${Object.keys(Z).filter(k => k.startsWith("word/media/")).length} imágenes\nWeb: ${mods.join(", ")} · ${B.length} títulos\n\n`;
const nuevos = W.filter(s => !BK.has(s.key));
rep += `## Nuevo en el Word (no está en la web): ${nuevos.length}\n\n` + (nuevos.map(s => `${pad(s)}- M${s.mod} · ${"#".repeat(s.lv)} ${s.title} · ${s.figs} fig, ${s.tabs} tab, ${s.eqs} fórm.`).join("\n") || "(ninguno)") + "\n\n";
const fuera = B.filter(s => !WK.has(s.key));
rep += `## En la web pero no en el Word: ${fuera.length}\n\n(Puede ser contenido complementario, un título reescrito o algo eliminado del Word.)\n\n` + (fuera.map(s => `${pad(s)}- M${s.mod} · ${"#".repeat(s.lv)} ${s.title}`).join("\n") || "(ninguno)") + "\n\n";
const comunes = W.filter(s => s.lv > 1 && BK.has(s.key)).map(s => { const b = BK.get(s.key); return { s, b, r: sim(s.text, b.text) }; });
rep += `## Apartados comunes, de menos a más parecidos\n\nsimilitud = coincidencia de pares de palabras (1.00 = mismo texto). Revisa a mano todo lo que baje de 0.90 y cualquier cambio en el número de figuras o tablas.\n\n| Módulo | Apartado | Similitud | Fig. Word/web | Tab. Word/web |\n|---|---|---|---|---|\n`;
rep += comunes.sort((a, b) => a.r - b.r).map(({ s, b, r }) => `| ${s.mod} | ${"#".repeat(s.lv)} ${s.title} | ${r.toFixed(2)} | ${s.figs}/${b.figs} | ${s.tabs}/${b.tabs} |`).join("\n") + "\n";
// cambios del Word desde la última sincronización (la copia que guarda la skill tras cada actualización)
let resumenPrev = "sin copia anterior del Word";
if (prev && fs.existsSync(prev)) {
  const P = sections(fs.readFileSync(prev, "utf8"), true), PK = new Map(P.map(s => [s.key, s])), WK2 = new Set(W.map(s => s.key));
  const alta = W.filter(s => !PK.has(s.key)), baja = P.filter(s => !WK2.has(s.key));
  const mod = W.filter(s => PK.has(s.key)).map(s => { const p = PK.get(s.key); return { s, p, r: sim(s.text, p.text) }; }).filter(x => x.r < 0.999 || x.s.figs !== x.p.figs || x.s.tabs !== x.p.tabs || x.s.eqs !== x.p.eqs);
  rep += `\n## Cambios en el Word desde la última sincronización\n\nComparado con ${prev}. Para ver el detalle de un apartado: \`git diff --no-index --word-diff <copia-anterior> word.md\`.\n\n`;
  rep += `Apartados añadidos: ${alta.length}\n` + alta.map(s => `${pad(s)}- M${s.mod} · ${"#".repeat(s.lv)} ${s.title}`).join("\n") + `\n\nApartados eliminados: ${baja.length}\n` + baja.map(s => `${pad(s)}- M${s.mod} · ${"#".repeat(s.lv)} ${s.title}`).join("\n");
  rep += `\n\nApartados modificados: ${mod.length}\n\n| Módulo | Apartado | Similitud | Fig. antes→ahora | Tab. antes→ahora | Fórm. antes→ahora |\n|---|---|---|---|---|---|\n` + mod.sort((a, b) => a.r - b.r).map(({ s, p, r }) => `| ${s.mod} | ${"#".repeat(s.lv)} ${s.title} | ${r.toFixed(3)} | ${p.figs}→${s.figs} | ${p.tabs}→${s.tabs} | ${p.eqs}→${s.eqs} |`).join("\n") + "\n";
  resumenPrev = `desde la última sincronización: ${alta.length} añadidos, ${baja.length} eliminados, ${mod.length} modificados`;
}
fs.writeFileSync(path.join(out, "inventario.md"), rep);
console.log(`ok · frente a la web: ${nuevos.length} apartados nuevos, ${fuera.length} solo en la web · ${resumenPrev} → ${path.join(out, "inventario.md")}`);
