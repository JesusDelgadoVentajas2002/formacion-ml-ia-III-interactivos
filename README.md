# Formación ML/IA básica · Parte III — Deep Learning y Redes Neuronales

Curso web de Nter con figuras interactivas: de la neurona artificial al entrenamiento de redes profundas.

## Acceso

- **Curso:** https://jesusdelgadoventajas2002.github.io/formacion-ml-ia-III-interactivos/curso/
  - [Módulo 7 · Fundamentos de Redes Neuronales](https://jesusdelgadoventajas2002.github.io/formacion-ml-ia-III-interactivos/curso/modulo-7.html)
  - [Módulo 8 · Entrenamiento de Redes Neuronales](https://jesusdelgadoventajas2002.github.io/formacion-ml-ia-III-interactivos/curso/modulo-8.html)
- **Laboratorio (ejercicios):** https://jesusdelgadoventajas2002.github.io/formacion-ml-ia-III-interactivos/
  - 10 ejercicios interactivos (5 del Módulo 7 y 5 del Módulo 8) con botón **Corregir**: nota sobre 10, explicación de cada fallo y solución. Los 5 del Módulo 9 aparecen como «Próximamente».

Tema claro/oscuro con el botón de la barra superior o añadiendo `?theme=dark` a la URL.

## En local

Web estática, sin dependencias. Abre `curso/index.html` en el navegador, o sirve la carpeta:

```bash
python -m http.server 8000   # → http://localhost:8000/curso/
```

## Estructura

```
index.html          Laboratorio: ejercicios interactivos con corrección
curso/
  index.html        Portada del curso
  modulo-7.html     Módulo 7
  modulo-8.html     Módulo 8
  assets/           CSS, JS de figuras, datos, fuentes, imágenes
    js/ej-core.js     Ejercicios: cálculo (redes, datos, descenso); se puede probar en node
    js/ejercicios.js  Ejercicios: figuras, puntuación y corrección
```

Al cambiar CSS o JS, actualiza el parámetro `?v=` de los enlaces en los HTML para evitar la caché del navegador.

## Actualizar la web con el Word

1. Pon el `.docx` del curso en `Word/` (no se sube al repositorio).
2. Abre el repositorio con un agente que lea skills (Claude Code, Codex, Gemini CLI, Cursor o VS Code con Copilot) y pídele «actualiza la web con el Word». En Claude Code también vale `/actualizar-curso`.

La skill está en `.agents/skills/actualizar-curso/`. Necesita Node 20 o superior y Google Chrome. Deja los cambios en un commit; el push se hace a mano.
