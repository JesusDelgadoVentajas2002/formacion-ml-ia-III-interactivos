// LaTeX → HTML de KaTeX, igual que las fórmulas ya publicadas (solo HTML, sin MathML).
// Uso: node math.mjs <entrada.json>   donde la entrada es [{"id":"eq-12","tex":"J(w)=…","display":true}, …]
// Escribe <entrada>.html.json con [{"id","html"}]. Una fórmula en bloque se envuelve en <div class="eq">…</div>.
import fs from "node:fs";
import katex from "katex";

const inp = process.argv[2];
const items = JSON.parse(fs.readFileSync(inp, "utf8"));
let bad = 0;
const out = items.map(({ id, tex, display }) => {
  try {
    const html = katex.renderToString(tex, { displayMode: !!display, output: "html", throwOnError: true, strict: "ignore" });
    return { id, html: display ? `<div class="eq">${html}</div>` : html };
  } catch (e) { bad++; console.error(`✗ ${id}: ${e.message}`); return { id, error: e.message }; }
});
fs.writeFileSync(inp.replace(/\.json$/, "") + ".html.json", JSON.stringify(out, null, 1));
console.log(`${items.length - bad} fórmulas renderizadas, ${bad} con error`);
process.exit(bad ? 1 : 0);
