---
name: actualizar-curso
description: Sincroniza la web del curso Nter con el Word de la carpeta Word/. Detecta módulos, apartados y cambios nuevos, los maqueta con figuras interactivas, crea los ejercicios del laboratorio, prueba la web y hace commit sin push. Úsala cuando pidan actualizar o sincronizar la web con el Word, o publicar un módulo o apartado nuevo.
---

# Actualizar la web del curso desde el Word

Todas las rutas son relativas a la raíz del repositorio, que es también la raíz de la web (GitHub Pages publica al hacer push).

- **Word**: el `.docx` más reciente de `Word/`. Esa carpeta está en `.gitignore`: cada persona pone ahí su copia. Si no hay ningún `.docx`, pide al usuario que lo coloque ahí y para.
- **Herramientas**: `.agents/skills/actualizar-curso/scripts/` (`inventario`, `math`, `img`, `selftest`). Si falta `node_modules`, ejecuta `npm install` ahí. Necesitan Node 20 o superior; `selftest` necesita además Google Chrome (si no lo encuentra, se le indica la ruta con la variable `CHROME`).
- **Copia del último Word sincronizado**: `.agents/skills/actualizar-curso/estado/ultimo-word.md`. Está en git, así que todo el equipo compara contra la misma sincronización.
- **Carpeta de trabajo**: tu directorio temporal. Nada de lo que generes ahí entra en la web salvo lo que copies a propósito.

En el paso 5 tienes que mirar capturas de pantalla: necesitas poder leer imágenes.

La web no es una copia literal del Word: sus textos están adaptados a las figuras interactivas («Figura 2a», «pulsa…») y tiene contenido complementario propio. Por eso la fuente de verdad de *qué ha cambiado* es la comparación del Word nuevo con `ultimo-word.md`, y la comparación con la web solo sirve para ver la estructura.

## 1. Inventario

Desde la raíz del repositorio, con `S=.agents/skills/actualizar-curso`:

```bash
node $S/scripts/inventario.mjs "Word/<docx>" . <trabajo> $S/estado/ultimo-word.md
```

Lee `<trabajo>/inventario.md`. Para cada apartado modificado, mira el detalle con `git diff --no-index --word-diff $S/estado/ultimo-word.md <trabajo>/word.md`. Clasifica **cada fila** del inventario en una de tres clases:

- **Nuevo**: módulo, apartado, figura o tabla que no existe en la web. Siempre se construye.
- **Cambio de contenido**: cambia un dato, número, definición, fórmula, ejemplo, paso, título, figura o tabla, o añade o quita una frase con información. Se lleva a la web.
- **Cambio sin efecto**: puntuación, erratas que la web ya tiene bien, la misma idea con otras palabras. No se toca, y anotas el porqué para el informe.

Después dile al usuario en dos o tres líneas qué has encontrado («Hay un Módulo 9 con 4 apartados, 12 figuras y 6 tablas; en el 8.3 cambia el ejemplo de lotes») y sigue sin esperar respuesta. Si no hay ni nuevos ni cambios de contenido, dilo y termina: sin commit.

**Hecho cuando** cada fila del inventario tiene clase y, si no se toca, motivo.

## 2. Construir el contenido

Sigue [WEB.md](WEB.md) para la maqueta, los identificadores, las fórmulas y las figuras. Para cada apartado nuevo o cambiado, recorre su parte de `word.md` bloque a bloque:

- **Texto, listas y tablas**: tal cual en el Word, con negritas y cursivas.
- **Fórmulas**: pásalas a LaTeX a partir de `omml/eq-N.xml` y renderízalas con `math.mjs`.
- **Figuras**: cada figura del Word se convierte en una **figura interactiva** que la reproduce y deja tocarla, con la imagen del Word como respaldo (`img.mjs`).
- **Complementos**: añade figuras interactivas, gráficos o tablas que el Word no tiene cuando ayuden de verdad a entender una idea del apartado (ver un efecto al mover un parámetro, comparar casos, seguir un cálculo paso a paso). Márcalos como complemento (WEB.md) para que nunca alteren la numeración del Word y anótalos para el informe.

**Hecho cuando** todos los bloques del Word del apartado están en la página, cada «Figura N» y «Tabla N» tiene su elemento con ese número y cada referencia cruzada apunta a un id existente.

## 3. Integrarlo en el sitio

Si es un módulo nuevo, crea su página y actualiza todo lo que lo nombra: la barra de navegación de todas las páginas (incluido el laboratorio), la portada (tarjeta, índice de contenido y recuento de figuras y tablas), la paginación anterior/siguiente y los scripts que carga. Detalle en WEB.md, apartado «Módulo nuevo».

**Hecho cuando** el módulo se alcanza desde la portada, desde la barra de cualquier página y desde la paginación, y no queda ningún «Próximamente» para él.

## 4. Laboratorio

Sigue [LAB.md](LAB.md).

- **Módulo nuevo**: sus 5 tarjetas «Próximamente» se convierten en 5 ejercicios. Si no tenía tarjetas, crea su bloque con 5.
- **Apartado nuevo en un módulo existente**: añade un ejercicio solo si introduce algo que ningún ejercicio del módulo practica, y anótalo.

**Hecho cuando** cada ejercicio nuevo está calibrado en node (objetivo alcanzable y no trivial) y su solución saca 10.

## 5. Verificar

```bash
node $S/scripts/selftest.mjs . <trabajo>                              # todo el sitio (~1–2 min)
node $S/scripts/selftest.mjs . <trabajo> shot <página> <id> [dark]    # p. ej. curso/modulo-9.html fig-47
```

1. Ejecuta `node --check` en cada JS tocado.
2. Pasa el selftest completo: sin errores de JavaScript, sin figuras rotas, sin enlaces internos rotos, laboratorio a 0 sin tocar y a 10 con cada solución.
3. Captura cada figura, tabla y ejercicio nuevo o cambiado en modo claro y oscuro, y **mira cada captura**: textos que se pisan o se cortan, lienzos vacíos, paneles de distinta altura, colores sin contraste. Corrige y vuelve a capturar.
4. Sube el parámetro `?v=` a la fecha de hoy (`AAAAMMDD`) en todos los HTML que cargan un CSS o JS cambiado.

**Hecho cuando** el selftest sale todo en ✓ y las capturas de todo lo nuevo están revisadas sin defectos.

## 6. Cerrar

1. Copia `<trabajo>/word.md` sobre `$S/estado/ultimo-word.md`, solo con el selftest en verde.
2. Ejecuta `git add .` y haz un commit con un mensaje de **una frase en inglés**, sin línea `Co-Authored-By`. El push lo hace el usuario.
3. Informa al usuario:
   - qué había de nuevo y qué has construido;
   - qué cambios has llevado a la web y cuáles has descartado, con su motivo;
   - qué complementos has añadido y por qué;
   - qué ejercicios has creado;
   - el resultado del selftest;
   - el recordatorio de que falta el push.
