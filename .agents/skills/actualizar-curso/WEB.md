# Maqueta de la web del curso

Rutas relativas a la raíz del repositorio. Antes de escribir una pieza, abre la más parecida que ya exista en `curso/modulo-8.html` y cópiale la forma: este documento recoge lo que no se deduce a simple vista.

## Páginas

- `index.html` (raíz): el laboratorio (ver LAB.md).
- `curso/index.html`: la portada.
- `curso/modulo-N.html`: un módulo por página, con una barra superior, un índice lateral (`aside.sidebar > ul.toc`), `<article class="article">` y la paginación.
- Estilos: `curso/assets/curso.css` y `tabs.css`. Motor de figuras: `curso/assets/js/curso.js` (`window.Curso`).
- Las imágenes de respaldo van en `curso/assets/fig/fig-N.webp`, con N la numeración global de figuras.

## Títulos e identificadores

| Word | HTML |
|---|---|
| Heading1 «Módulo N. Título» | `<header class="mod-hero"><p class="kicker">Formación ML/IA básica · Parte III</p><h1 id="top">Módulo N. Título</h1></header>` |
| Heading2 «K. Título» | `<h2 id="ap-K"><span class="gen">K. </span>Título<a class="anchor" href="#ap-K" aria-label="Enlace a esta sección">#</a></h2>` |
| Heading3 «K.M. Título» | `<h3 id="ap-K-M">K.M. Título<a class="anchor" …>#</a></h3>` |
| Heading4 «Título» | `<h4 id="h-slug">Título<a class="anchor" …>#</a></h4>` |

- El slug va en minúsculas, sin tildes y con guiones. Debe ser único en la página: si se repite, añade `-2`, `-3`. Hoy `modulo-8.html` tiene dos `h-como-se-combate`; si tocas esa página, corrige el segundo a `h-como-se-combate-2` y su enlace en el índice.
- Cada título entra en el índice lateral con la misma jerarquía: `<li><a href="#id">texto</a><ul>…</ul></li>`. El índice y el resaltado al hacer scroll se basan en esos ids.

## Bloques

- **Párrafo**: `<p>…</p>`, con `<strong>`, `<em>` y `<code>`.
- **Lista**: `<ul><li>…</li></ul>` u `<ol>`.
- **Referencia cruzada**: `<a class="xref" href="#fig-12">Figura 12</a>`, `#tab-N` o `#ap-K-M`.
- **Fórmula en bloque**: `<div class="eq">KaTeX</div>`. En línea, el `<span class="katex">…</span>` dentro del párrafo. Una fórmula sola centrada en su párrafo usa `<p class="center">`.
- **Tabla**:
  ```html
  <div class="table-block" id="tab-N"><p class="tcap"><em>Tabla N. Título.</em></p><div class="tbl-wrap"><table class="nter">
  <thead><tr><th><p><strong>Col</strong></p></th>…</tr></thead><tbody><tr><td><p>…</p></td>…</tr></tbody></table></div></div>
  ```

## Fórmulas

El Word guarda cada fórmula en OMML. `inventario.mjs` deja su texto plano en `word.md` (`$…$ {eq-N}`) y el XML original en `omml/eq-N.xml`. Escribe el LaTeX leyendo el XML (`m:f` fracción, `m:sSub`/`m:sSup` subíndice y superíndice, `m:nary` sumatorio, `m:acc` acento, `m:d` paréntesis), reúnelas en un JSON `[{"id","tex","display"}]` y ejecuta `node $S/scripts/math.mjs <json>`. Usa el KaTeX 0.19.1 de `$S/scripts/node_modules`, el mismo que `curso/assets/katex/katex.min.css`. La web no carga KaTeX en el navegador: las fórmulas van ya renderizadas en el HTML.

## Figuras

Numeración global, la misma del Word: el Módulo 7 tiene las figuras 1–27 y el 8 las 28–45. Las tablas siguen la misma regla (Módulo 8: 20–33). Si un cambio inserta una figura o tabla en medio, renumera a la vez el `id`, el pie, las referencias cruzadas de todas las páginas y el nombre del `.webp`.

```html
<figure class="fig interactive" id="fig-N"><div class="ifig" data-w="nombre-widget" data-opts='{}'><noscript><img src="assets/fig/fig-N.webp" alt=""></noscript></div><figcaption><em>Figura N. Pie del Word.</em></figcaption></figure>
```

- Añade la clase `wide` cuando la figura necesite todo el ancho.
- `data-opts` es un JSON que recibe el widget (para reutilizar uno con variantes, como `{"mode":"bio"}`).
- **Complemento** (no está en el Word): `<figure class="fig interactive extra" id="extra-slug">`, con el pie `<em>Complemento interactivo. …</em>`, sin número. No lleva respaldo `.webp`, porque no hay imagen en el Word.
- **Respaldo**: `node $S/scripts/img.mjs <trabajo>/media/imageX.png curso/assets/fig/fig-N.webp`. Localiza qué `imageX` es cada figura por su posición en `word.md`: la imagen `![](media/imageX.png)` va justo antes del pie `> Figura N.`.

### Widget

Se registra en `curso/assets/js/fig-mNx.js` (un fichero por bloque de apartados, unos 25–50 KB cada uno), dentro de una IIFE con `const C=Curso,{num,numT,F,rgba,arrow,rrect,node,ease}=C;`:

```js
C.define("nombre-widget",function(host,opts,api){
  const [A,B]=C.panels(host,[{W:520,H:360,sub:"(a) …"},{W:480,H:360,sub:"(b) …"}]);   // lienzos HiDPI con subtítulo azul
  function draw(){const k=A.k,c=k.c,P=api.pal();k.clear();const pl=new C.Plot(k,[56,20,500,320],{xr:[0,1],yr:[0,1]});pl.axes({xt:[0,.5,1],yt:[0,.5,1],xl:"…",yl:"…"});/* … */}
  const row=C.ctlRow(host);C.slider(row,"η",0,1,0.01,0.1,v=>{/*…*/draw()},v=>numT(v,2));
  const lp=C.loop(api,dt=>{/* animación */draw();return true});   // solo corre si la figura está a la vista
  draw();api.onTheme(draw);lp.start();
});
```

- **Colores**: siempre de `api.pal()` (`blue`, `red`, `green`, `orange`, `ocre`, `fillb`, `fillr`, `text`, `muted`, `bg`, `bg2`, `lgray`…), para que cambien con el tema. Nunca uses un hexadecimal suelto.
- **Números**: con `num`, `numT`, `thou` y `sci` (signo menos tipográfico, punto decimal).
- **Datos precalculados** (entrenamientos largos, series reales): ponlos en `curso/assets/js/data-mN.js` como `window.DATA_MN={…}`.
- **Paneles lado a lado**: si tienen distinto `W`, pasa `flex:"<W> 1 <W·0.55>px"` en cada spec para que queden a la misma altura (como hace `panels()` en `ejercicios.js`).
- **Textos**: en español. Qué hacer se explica en un `C.hint(host,"…")` o en un `C.readout`, no dentro del lienzo encima de los ejes.

## Módulo nuevo

1. Crea `curso/modulo-N.html` copiando `modulo-8.html` y vaciando el artículo. Actualiza `<title>`, `aria-current` en la barra, `p.mtitle` del índice, la paginación y los `<script>` del final (`curso.js`, `data-mN.js`, `fig-mN*.js` y `tabs.js` si usa alguna pestaña).
2. **Barra superior de todas las páginas**: `curso/index.html`, cada `curso/modulo-*.html` y el `index.html` raíz, con rutas `curso/…`. El `<span class="soon">Módulo N</span>` pasa a `<a class="" href="modulo-N.html">Módulo N</a>`. Deja un «Próximamente» para el módulo siguiente solo si el Word lo anuncia.
3. **Paginación**: en el módulo anterior, «Siguiente» apunta al nuevo, y el nuevo termina en «Volver · Inicio».
4. **Portada** (`curso/index.html`):
   - la tarjeta `div.modcard.soon` pasa a ser `<a class="modcard" href="modulo-N.html">` con un resumen de una línea y `<div class="meta">X figuras (X interactivas) · Y tablas</div>`;
   - añade un `w-panel` a «Contenido» con sus apartados.
5. **Laboratorio** (`index.html` raíz): la barra superior y el bloque del módulo (LAB.md).

## Caché

Todos los enlaces a CSS y JS llevan `?v=AAAAMMDD`. Al cambiar un fichero, sube la versión en cada HTML que lo cargue. Si no, los alumnos verán la versión antigua.
