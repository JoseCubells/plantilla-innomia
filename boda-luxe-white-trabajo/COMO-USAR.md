# Cómo usar la plantilla Boda Luxe White

La web es una sola carpeta: `boda-luxe-white/` con `index.html` y `assets/`. No hay que instalar nada.

## Cambiar los datos de la boda

Abre `boda-luxe-white/index.html` y busca el comentario `PLANTILLA: cambia aquí los datos de la boda`. Debajo está el bloque `WEDDING` con: nombres, monograma, fechas, lugar, dirección, fecha límite, enlace del mapa y de la mesa de regalos. Cambia los valores entre comillas. La página entera se actualiza.

Los textos largos (la historia, el programa, las dudas, los hoteles y el autobús) se editan directamente en el HTML, dentro de su sección. También hay que cambiar a mano el `<title>`, la descripción y las etiquetas `og:` de la cabecera.

## A dónde va el formulario

En el mismo bloque, `rsvp.mode`:

| Modo | Qué hace | Qué hay que rellenar |
|---|---|---|
| `demo` | Muestra el mensaje de éxito. La respuesta no llega a nadie. | Nada. Es el modo de la plantilla de muestra. |
| `mailto` | Abre el correo del invitado ya dirigido a la pareja. | `email` |
| `endpoint` | Envía la respuesta a un servicio gratuito de formularios, como Formspree. Llega al correo de la pareja. | `endpoint` (la URL que da el servicio) |
| `whatsapp` | Abre un mensaje de WhatsApp ya escrito. | `whatsappNumber`, con prefijo y solo cifras |

`whatsappNumber` también activa los enlaces "Por WhatsApp" de la página. Si un invitado cambia su respuesta en modo `endpoint`, la pareja recibe una segunda entrada con el mismo nombre.

## Las imágenes y el video

La página espera cuatro archivos en `boda-luxe-white/assets/`:

- `hero-scrub.mp4`: el video del descenso, recodificado para scroll (sin audio, a 60 fps, con un fotograma clave cada pocos fotogramas).
- `hero-poster.jpg`: su primer fotograma.
- `hero-ending.jpg`: su último fotograma. Es el hero de los móviles y la imagen de las vistas previas al compartir el enlace.
- `lugar.jpg`: la imagen de la sección "El lugar".

Los comandos de ffmpeg para prepararlos están en `references/ffmpeg-recipes.md`.

## Ver la web en tu ordenador

Desde la carpeta `boda-luxe-white/`, ejecuta `python3 -m http.server` y abre `http://localhost:8000`. Si abres `index.html` con doble clic, el navegador bloquea la descarga del video y ves el hero estático. Es lo esperado.

## Antes de publicar

Sustituye `og:image` y `og:url` (marcados con `DEPLOY STEP`) por las URLs absolutas reales. Y cambia el aviso del pie de página, que dice que la pareja es inventada.
