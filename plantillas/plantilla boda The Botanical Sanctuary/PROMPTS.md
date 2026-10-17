# The Botanical Sanctuary · Pack de prompts (Nano Banana Pro + Google Flow)

Todo lo visual de la plantilla sale de aquí. Primero las imágenes fijas con Nano Banana Pro, después el vídeo con Flow. Los prompts van en inglés porque los dos modelos los siguen con más precisión; las explicaciones, en español.

## El plan en una línea

Cinco fotogramas clave (K0 a K4) con Nano Banana Pro, cuatro segmentos de vídeo en Flow con **Frames to Video** (cada uno empieza en un fotograma clave y termina en el siguiente), un solo encode con ffmpeg. La web ya sabe que hay cuatro capítulos y hace coincidir cada frontera con cada unión.

```
K0 ──seg1──▶ K1 ──seg2──▶ K2 ──seg3──▶ K3 ──seg4──▶ K4
 El umbral     La mesa       El altar      La velada
 (0 a 25%)       (25 a 55%)      (55 a 80%)      (80 a 100%)
```

## Las reglas que no se tocan (del skill)

1. **El movimiento va con el scroll.** Bajar en la página es avanzar: la cámara siempre empuja hacia delante, nunca retrocede ni gira hacia atrás.
2. **Un solo plano, sin cortes, sin personas.** Nada de manos ni caras: la anatomía es lo primero que se rompe.
3. **El camino fijo, el mundo vivo.** Trayectoria limpia y constante; hojas, pétalos, polen, llamas y luz siempre en movimiento.
4. **El final se diseña primero.** K4 es donde la página descansa y donde aparece el RSVP.
5. **Espacio para el texto descrito como parte del mundo.** Nunca pidas "espacio vacío" u "oscuridad a los lados": el modelo pinta paneles negros. Describe neblina dorada, piedra lisa, sombra suave.
6. **Cero texto.** Todos los prompts llevan la coletilla. Los menús de papel de algodón se piden en blanco, con una ramita prensada: si llevan letra, el modelo inventa garabatos.
7. **Revisa cada imagen antes de animarla:** logos colados, objetos deformes, simetría. Rehacer una imagen es barato; rehacer un vídeo, no.

## Bloque de mundo (pégalo al final de TODOS los prompts de imagen)

```
World: a 19th-century wrought-iron and glass greenhouse on a European country estate, surrounded by ancient olive trees. Late afternoon golden hour, warm low sun filtering through foliage and old glass panes. Materials and palette: raw undyed linen, silver-green eucalyptus, olive green, dusty rose garden roses, warm honey-gold light, pale aged limestone, hand-made matte ceramics, fluted clear glass. Wild, loose botanical styling, fine-art wedding editorial, medium-format film look, soft natural grain, gentle halation on highlights, shallow depth of field, photorealistic. No people, no hands. No text, no logos, no lettering, no signage anywhere.
```

## 1. Fotogramas clave (Nano Banana Pro, 16:9, máxima resolución)

Genera K0 primero. Cuando te guste, súbelo como **imagen de referencia** para K1 a K4 y añade: `Same location, same light quality, same color grade and same styling as the reference image.` Así los cinco parecen un mismo lugar y una misma tarde.

### K0 · El umbral (primer fotograma del vídeo y póster)

```
Low ground-level camera, about 40 cm above the ground, at the start of an ancient worn limestone path that runs straight away from camera toward a wrought-iron and glass greenhouse far in the distance. The path bisects the frame dead center, the same distance from the left edge as from the right. Both sides of the path are lined edge to edge with low, wild floral arrangements of silver-dollar eucalyptus, olive branches and dusty-pink garden roses, the nearest ones softly out of focus in the foreground. The sun backlights the leaves from the upper right so they glow translucent. The upper half of the frame is a soft, continuous haze of golden light through distant olive canopy. Composed as the first moment of a slow forward glide along the path.
[bloque de mundo]
```

Texto que vivirá encima: nombres en la neblina dorada de la mitad superior, segunda frase abajo a la izquierda.

### K1 · La entrada a la mesa imperial

```
Standing eye-height camera just inside the open glass doors of the greenhouse. A single, endless imperial banquet table runs straight away from camera through the center of the greenhouse, dead center, vanishing into depth. Long raw-linen tablecloth, a loose garland of eucalyptus and olive along the middle, fluted clear glass goblets catching the sun, hand-made matte stone-colored ceramic plates, linen napkins tied with raw undyed twine, blank cream cotton-paper menu cards with deckled edges and a pressed sprig of rosemary, no writing on them. Unlit cylindrical pillar candles in clear glass hurricanes along the table. Warm sunlight falls in long stripes through the glass roof. The side aisles to the left and right of the table are calm areas of soft warm shade and greenery.
[bloque de mundo]
Same location, same light quality, same color grade and same styling as the reference image.
```

Texto que vivirá encima: tarjetas de vidrio esmerilado a izquierda y derecha de la mesa. El centro (la mesa) queda libre.

### K2 · El final de la mesa, el arco al fondo

```
Low camera at table height near the far end of the same imperial banquet table, looking along the last place settings: fluted glass goblets refracting golden light, matte ceramic plates, linen napkins tied with raw twine, blank cotton-paper menus with a pressed sprig. Beyond the end of the table, centered, a sculptural contemporary organic floral arch stands on a raised floor of pale ancient stone, framed by the open glass end wall of the greenhouse and the olive grove behind it. Low sun behind the arch.
[bloque de mundo]
Same location, same light quality, same color grade and same styling as the reference image.
```

### K3 · El altar arquitectónico

```
Standing eye-height camera a few steps in front of a sculptural organic floral arch, the arch bisects the frame dead center and fills the central two thirds. The arch is asymmetric and wild: eucalyptus, olive branches, dusty-pink and cream garden roses, dried grasses, on a slender hidden structure. The sun is very low behind and slightly left of the arch, casting long, elongated shadows of the arch and of a few linen-draped chairs across the pale ancient stone floor toward camera. Warm rim light on every leaf. The stone floor in the lower third is smooth and calm.
[bloque de mundo]
Same location, same light quality, same color grade and same styling as the reference image.
```

### K4 · La velada (el final donde descansa la web)

Usa **K3 como referencia** (además de K0) y pide el mismo encuadre, un poco más cerca:

```
Exactly the same place and composition as the reference image of the floral arch, the camera a few steps closer, the arch dead center. Blue hour: the daylight is gone, the glass of the greenhouse holds a deep blue-green dusk. Hundreds of lit cylindrical pillar candles in clear glass hurricane lanterns of different heights stand on the stone floor around the arch, along the path and on the table in the background, warm flickering glow, soft reflections on the old glass. The space under and in front of the arch is a calm, softly lit area of warm shadow. The edges of the frame fall naturally darker, a gentle natural vignette. Composed as a resting final frame: everything arrived, still and warm.
[bloque de mundo, cambiando "Late afternoon golden hour" por "Blue hour after sunset, candlelight"]
Same location, same styling as the reference image.
```

Aquí aparece el formulario RSVP, centrado. La zona bajo el arco tiene que ser tranquila.

### Revisión de los cinco (antes de gastar en vídeo)

- ¿Parece el mismo lugar y la misma tarde? Si uno desentona, rehaz ese.
- ¿Hay letras, logos, marcas en copas o platos? Fuera.
- ¿El centro está de verdad centrado en K0, K1, K3 y K4?
- Pon K4 con la barra de navegación imaginada arriba: ¿respira?

## 2. Vídeo (Google Flow, Veo 3.1, Frames to Video)

Ajustes: 16:9, calidad máxima, 8 segundos por segmento, descarga a 1080p. El audio no hace falta (se elimina en el encode). Si Flow ofrece un preset o reescribe el prompt, quédate con el tuyo.

### Segmento 1 · K0 ▶ K1 · El umbral

```
One continuous shot, no cuts. A smooth, steady forward dolly along the ancient stone path at a constant slow walking pace, the camera rising gently from ground level to standing eye height as it reaches the open glass doors of the greenhouse and enters, revealing the long banquet table. The flowers and leaves on both sides stay alive: eucalyptus leaves turning and catching the light, roses trembling, olive branches swaying in a soft warm breeze. Golden dust and pollen drift through the sunbeams. The camera never stops and never slows down. No people. No text or lettering anywhere.
```

### Segmento 2 · K1 ▶ K2 · La mesa imperial

```
One continuous shot, no cuts. The camera continues forward at the same constant pace and gently descends to table height, gliding along the center line of the endless imperial banquet table. Fluted glass goblets refract and sparkle as light moves across them, linen napkins tied with raw twine, matte ceramic plates, blank cotton-paper menus with pressed sprigs pass by on both sides. The eucalyptus garland stirs slightly. Sunlight flickers through the glass roof as leaves move outside. At the end the floral arch appears beyond the table. The camera never stops. No people. No text or lettering anywhere.
```

### Segmento 3 · K2 ▶ K3 · El altar

```
One continuous shot, no cuts. The camera continues forward past the end of the table at the same pace and rises smoothly to standing eye height, approaching the sculptural floral arch head-on until it fills the center of the frame. The sun sinks lower behind the arch and the shadows of the arch and the chairs visibly stretch longer across the pale stone floor. Petals and leaves move gently in the breeze, warm rim light shimmers. The camera slows only in the last second. No people. No text or lettering anywhere.
```

### Segmento 4 · K3 ▶ K4 · La velada

```
One continuous shot, no cuts. The camera is almost still, a very slow push-in of a few steps toward the floral arch. Time passes: the golden light fades into a deep blue-green dusk inside the glass greenhouse, and the pillar candles in glass hurricane lanterns light up, first a few, then dozens, then hundreds, around the arch, along the path and on the table behind. Flames flicker softly and their glow reflects on the old glass. The shot ends at rest: the arch centered, hundreds of candles glowing, the space under the arch calm and warm, the edges falling into soft darkness. No people. No text or lettering anywhere.
```

### La puerta de vídeo (cada segmento)

Míralo entero antes de seguir. Busca: saltos de velocidad cerca de los fotogramas clave, objetos que se transforman, letras que aparecen, velas deformes. Si un segmento falla tres veces, el problema es el concepto de ese tramo, no el prompt: cambia el fotograma clave.

## 3. Dónde dejar los archivos

```
plantilla boda The Botanical Sanctuary/
├── review/                 ← brutos de Flow y Nano Banana (NO se publica, está en .gitignore)
│   ├── K0.png … K4.png
│   └── seg1.mp4 … seg4.mp4
└── web/                    ← lo único que se publica
    └── assets/
        ├── video/hero-scrub.mp4
        └── img/
            ├── ch1.jpg ch2.jpg ch3.jpg ch4.jpg      (16:9)
            ├── ch1-v.jpg … ch4-v.jpg                (9:16, opcional, para móvil)
            ├── detalle-copa.jpg detalle-ceramica.jpg detalle-menu.jpg   (4:5)
            └── og.jpg                                (1200x630)
```

## 4. Procesado (ffmpeg, desde la carpeta de la plantilla)

**El vídeo del hero, un solo encode.** Se quita el primer fotograma de los segmentos 2, 3 y 4 porque repiten el fotograma clave anterior:

```
ffmpeg -i review/seg1.mp4 -i review/seg2.mp4 -i review/seg3.mp4 -i review/seg4.mp4 -filter_complex "[0:v]setpts=PTS-STARTPTS[a];[1:v]trim=start_frame=1,setpts=PTS-STARTPTS[b];[2:v]trim=start_frame=1,setpts=PTS-STARTPTS[c];[3:v]trim=start_frame=1,setpts=PTS-STARTPTS[d];[a][b][c][d]concat=n=4:v=1:a=0,scale=1600:-2[v]" -map "[v]" -c:v libx264 -crf 25 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an web/assets/video/hero-scrub.mp4
```

Follaje y velas son metraje con mucho detalle, así que aguantan crf 25 y 1600 px de ancho. Objetivo: 12 a 20 MB para los 32 segundos. Si pasa de 20 MB, sube a crf 26 o baja a 1440 px. Si en la penumbra ves escalones de color (banding), baja a crf 23. Si una unión se nota, usa el fundido de `references/ffmpeg-recipes.md` (offsets 7.75, 15.5 y 23.25 para segmentos de 8 s).

**Las imágenes de capítulo** (K0, K1, K3 y K4):

```
ffmpeg -i review/K0.png -vf scale=1920:-2 -q:v 2 web/assets/img/ch1.jpg
ffmpeg -i review/K1.png -vf scale=1920:-2 -q:v 2 web/assets/img/ch2.jpg
ffmpeg -i review/K3.png -vf scale=1920:-2 -q:v 2 web/assets/img/ch3.jpg
ffmpeg -i review/K4.png -vf scale=1920:-2 -q:v 2 web/assets/img/ch4.jpg
```

**Fotos de detalle** a 1200 px de ancho con `-vf scale=1200:-2 -q:v 2`.

**Comprueba el peso exacto del vídeo** (`ls -l web/assets/video/hero-scrub.mp4`) y ponlo en `videoBytes` de la configuración.

## 5. Encender los assets en la web

En `web/index.html`, bloque `window.SANCTUARY`, rellena las rutas que tengas (lo que quede en `null` sigue usando la escena dibujada, sin errores):

```js
video: 'assets/video/hero-scrub.mp4',
videoBytes: 15800000,
stills: ['assets/img/ch1.jpg','assets/img/ch2.jpg','assets/img/ch3.jpg','assets/img/ch4.jpg'],
stillsPortrait: ['assets/img/ch1-v.jpg', ...],
details: ['assets/img/detalle-copa.jpg','assets/img/detalle-ceramica.jpg','assets/img/detalle-menu.jpg'],
chapterTimes: [0, .25, .5, .75, 1]   // dónde empieza cada segmento dentro del vídeo
```

Si los segmentos no duran lo mismo (por ejemplo, el 4 dura 6 s), ajusta `chapterTimes` con la fracción real del vídeo en la que empieza cada uno.

## 6. Imágenes de apoyo (Nano Banana Pro, 4:5, con K1 como referencia)

**Copa de cristal estriado**
```
Close-up still life on a raw linen tablecloth: a single fluted clear glass goblet, golden afternoon sun passing through it and throwing a caustic pattern of light on the linen, a eucalyptus leaf beside it, shallow depth of field. Calm soft background of warm greenhouse shade.
[bloque de mundo]
```

**Cerámica mate hecha a mano**
```
Top-down still life on raw linen: a hand-made matte stone-colored ceramic plate with a linen napkin folded on it, tied with raw undyed twine and a small olive sprig. Soft golden side light, gentle shadows.
[bloque de mundo]
```

**Menú en papel de algodón**
```
Still life on raw linen: a blank cream cotton-paper menu card with a deckled edge resting on a matte ceramic plate, a pressed sprig of rosemary and a dried dusty-pink rose petal on top. No writing on the card. Soft golden side light.
[bloque de mundo]
```

**og.jpg** (vista previa al compartir el enlace): recorta K4 a 1200x630.
