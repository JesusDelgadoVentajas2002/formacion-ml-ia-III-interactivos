// Imagen del Word → respaldo .webp de una figura, con el mismo ancho máximo que las existentes.
// Uso: node img.mjs <origen.png|jpg|emf…> <destino.webp>
import sharp from "sharp";

const [src, dst] = process.argv.slice(2);
if (!src || !dst) { console.error("uso: node img.mjs <origen> <destino.webp>"); process.exit(1); }
const info = await sharp(src).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dst);
console.log(`${dst} · ${info.width}×${info.height} · ${Math.round(info.size / 1024)} KB`);
