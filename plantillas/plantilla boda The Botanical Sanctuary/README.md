# The Botanical Sanctuary

Plantilla de web inmersiva para bodas. Un invernadero de hierro y cristal en una finca europea, recorrido con el scroll en cuatro láminas: el sendero, la mesa imperial, el altar y la velada, donde el invitado confirma su asistencia encendiendo su vela.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `SKILL.md` y `references/` | El método de trabajo (copiado de la raíz del repositorio). |
| `DISENO.md` | El paquete de diseño: premisa, paleta, tipografías, mapa de bandas y todo el texto. |
| `PROMPTS.md` | Los prompts para Nano Banana Pro y Google Flow, dónde dejar los archivos y cómo procesarlos. |
| `web/` | La web. Lo único que se publica. |
| `review/` | (créala tú) brutos de Flow y Nano Banana. No se publica y está en `.gitignore`. |

## Verla en local

```
cd "plantillas/plantilla boda The Botanical Sanctuary/web"
npx http-server -c-1
```

Abre la dirección que aparece en el navegador. Si haces doble clic en `index.html` también se ve, pero el vídeo no carga desde un archivo local (es lo normal: el navegador lo bloquea).

## Estado actual

- Funciona ya sin ninguna imagen: cada lámina pinta una escena dibujada que se mueve con el scroll.
- En escritorio: recorrido con scroll de 1300vh, hojas en primer plano que se mecen con la velocidad del scroll, polen que se vuelve brasa, velas que se encienden, viñeteado y RSVP.
- En móvil, tablet en vertical y con movimiento reducido: las cuatro láminas apiladas, sin descargar vídeo.
- RSVP en modo demo: muestra el agradecimiento pero no envía nada. Para una boda real, pon `rsvpEndpoint` (Formspree) o `rsvpEmail` en la configuración.

## Personalizar para una boda

1. Nombres, fecha, lugar, horarios, hoteles, IBAN y preguntas: directamente en `web/index.html`.
2. Fecha de la cuenta atrás: `weddingDate` en el bloque `window.SANCTUARY`.
3. Imágenes y vídeo: sigue `PROMPTS.md` y rellena las rutas en `window.SANCTUARY`.
4. Con el metraje real, repasa la legibilidad de cada banda (sección "worst-frame audit" de `references/scrub-pipeline.md`) y ajusta los velos (`.band::before`) si alguna frase cae sobre una zona muy clara.
5. Antes de publicar: sustituye `https://EJEMPLO.com/` en las etiquetas `og:` del `<head>` por la dirección real.
