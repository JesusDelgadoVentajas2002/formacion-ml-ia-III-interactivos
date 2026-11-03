# Ejercicios del laboratorio

El laboratorio es `index.html` en la raíz de la web. Cada ejercicio es un **mini laboratorio con un objetivo**: el alumno monta, ajusta o entrena algo, la figura responde al momento y la nota llega solo al final, con el botón «Corregir». No hay preguntas tipo test sueltas ni ejercicios de arrastrar tarjetas: como mucho, una pregunta de una respuesta *dentro* de un ejercicio visual, y que valga 2–3 de los 10 puntos.

## Ficheros

- `curso/assets/js/ej-core.js`: cálculo sin DOM, probable en node (`module.exports`). Incluye `MLP` (Adam, L2, dropout), conjuntos de datos (`xorData`, `moons`), `fitKnots`, `descend1`, `optimize` y `gradProfile`. Lo numérico nuevo va aquí.
- `curso/assets/js/ejercicios.js`: un `C.define("ej-mN-K", …)` por ejercicio, el registro y la corrección.
- `curso/assets/ejercicios.css`: estilos de la corrección, la barra inferior, la ventana de nota y las tarjetas «Próximamente».

## Un ejercicio

HTML, en el bloque del módulo (`<h2 id="mN">`) y en el mismo orden que el índice lateral:

```html
<section class="ej" data-ej="mN-K">
  <div class="ej-head"><span class="ej-n">Ejercicio G</span><h3 id="ej-mN-K">Título con verbo</h3><span class="ej-ref">Repaso: <a href="curso/modulo-N.html#ap-K-M">Módulo N · K.M</a></span></div>
  <p class="ej-goal"><b>Objetivo:</b> qué conseguir, con el umbral medible en negrita.</p>
  <div class="ifig" data-w="ej-mN-K"></div><div class="ej-fb" hidden></div>
</section>
```

G es el número global del ejercicio (11–15 para el Módulo 9). JS:

```js
C.define("ej-mN-K",function(host,opts,api){
  const st={…};                                   // estado que se corrige
  /* lienzos con panels(), controles de Curso; en cada interacción: ex.touch() */
  const ex=reg("mN-K",host,{
    grade(){ return {items:[it(puntos,máximo,"html: qué ha hecho y por qué está bien o mal, con sus números y el apartado del curso"),…], sol:"html de la solución"}; },
    solve(){ /* pone el estado de la solución y lo dibuja (o entrena) */ }});
});
```

- Los máximos de `items` suman 10. Usa nota parcial: hay que distinguir «casi» de «nada».
- Cada texto de `grade()` dice **qué hizo el alumno**, con sus números, y **por qué** está bien o mal. Cuando falla, enlaza o cita el apartado del curso.
- Si el ejercicio depende de una acción (entrenar, lanzar), corrige el estado actual. Si la acción no se ha hecho, devuelve un único item de 0 que lo diga.
- Para una fracción de 10/3, usa `T*0.4` y `T*0.6` (con `T=10/3`), no 1.33 y 2: la suma tiene que llegar exacta a T, o la casilla saldrá en naranja con la nota completa.

## Diseño y calibración

1. **Elige qué tocar**: el mecanismo central del apartado (lo que el alumno debería poder *hacer*), con una visualización que reaccione al instante: la red dibujada con sus neuronas encendidas, el paisaje de coste, la frontera de decisión, las curvas de entrenamiento.
2. **Calibra en node antes de dibujar**: escribe en `ej-core.js` la función que calcula el resultado y recorre la rejilla de opciones del alumno. El objetivo tiene que ser alcanzable con una configuración razonable y fallar con la configuración inicial y con la «obvia pero equivocada». Las cuentas de partida y de solución deben quedar lejos del umbral.
3. **El estado inicial muestra el problema** sin resolverlo (en el ejercicio 9, por ejemplo, la red empieza con el gradiente desvanecido) y nunca diverge ni sale en blanco nada más abrir.
4. **`solve()` lleva a una configuración que saca 10**, y `sol` explica por qué funciona y qué alternativas también valen.

## Al añadir ejercicios

- Añade el id a `ORDER` en `ejercicios.js`. La nota final es la media de `ORDER`.
- Actualiza los textos con el total («de 10 ejercicios empezados»): en `updBar()` de `ejercicios.js` y en el `#ejDone` inicial del HTML. Lo más limpio es usar `ORDER.length`.
- En el índice lateral, el enlace del módulo deja de ser `a.soon` y lista sus ejercicios.
- Elimina las tarjetas `.soon-card` que se han convertido en ejercicios y el párrafo «estarán disponibles cuando…».
- Añade cuántos ejercicios hay en el subtítulo del héroe si cambia el total («Diez retos…»).

## Verificación

`selftest.mjs` abre el laboratorio, corrige sin tocar nada (debe salir 0), aplica la solución de cada ejercicio uno a uno y vuelve a corregir: todos deben sacar 10/10. Después captura cada ejercicio nuevo en claro y oscuro con el modo `shot` (id `ej-mN-K`) y revisa las imágenes.
