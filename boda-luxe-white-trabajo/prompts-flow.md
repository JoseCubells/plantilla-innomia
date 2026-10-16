# Prompts para Google Flow

Los prompts van en inglés porque los generadores los entienden mejor. Los ajustes van en español. Todos pasan las leyes del skill: sin personas, sin texto ni logos, un solo plano, la acción en el centro y el final compuesto antes de generar.

Orden de trabajo: imagen inicial, imagen final, video. La imagen final se genera usando la inicial como referencia para que sea la misma sala.

## 1. Imagen inicial (Nano Banana Pro, 16:9, la resolución más alta que ofrezca)

```
Photorealistic luxury wedding reception inside a vast clear-roof marquee, captured as the first frame of a slow downward crane move. A monolithic suspended ring of white hydrangeas, roses and peonies hangs high across the top of the frame. From its center a tall cylindrical cascade of faceted crystal strands falls straight down the exact middle of the frame: it bisects the image, dead center, the same distance from the left edge as from the right, glittering softly. Both halves of the frame on either side of the cascade receive the identical calm treatment: long curved swags of white silk drapes with warm micro fairy lights glowing in the folds, soft and even, with no objects and no bright highlights on either side. Far below, out of focus, a spotless glossy white dance floor, round tables with snow-white linen, tall candelabra, and floor-to-ceiling glass walls showing soft desaturated sage-green garden foliage. Light: soft diffused daylight through the translucent roof, warm pinpoint fairy lights, crystal glints. Palette as materials: pure white petals, ivory silk, snow-white linen, clear crystal and glass, a trace of silvery sage green in the leaves, a hint of warm gold in the tiny lights. One continuous world filling the frame edge to edge. The venue is completely empty: no people, no guests, no staff, no silhouettes. Cinematic, photorealistic, 16:9. No text, no logos, no lettering anywhere.
```

## 2. Imagen final (Nano Banana Pro, 16:9, usando la imagen 2 como referencia)

La primera versión de la imagen final (la imagen 2) quedó demasiado parecida a la inicial: la araña ocupa casi todo el alto en las dos y la corona sigue recortada arriba, así que el recorrido se ve corto. Esta versión retrocede mucho más. Se usa la imagen 2 como referencia porque su sala y sus mesas son buenas. La imagen 2 se conserva: sirve para la sección "El lugar" y el hero del móvil.

```
Using the reference image as the exact same venue, the same marquee, the same floral ring, the same crystal chandelier, the same tables and chairs, re-frame it as a much wider establishing shot, as if the camera had descended to eye level and pulled far back to the near end of the long white dance floor. The glossy white dance floor now fills the entire lower half of the frame, leading away from the camera toward the far end of the marquee, with a soft reflection of the chandelier on it. At the far end of the floor, centered on the axis beneath the chandelier, a tall tiered white wedding cake decorated with white flowers stands on a white pedestal, small in the frame. The suspended ring of white flowers and the crystal chandelier now sit small and centered in the upper middle of the frame, fully visible with calm space around them, no longer cropped by the top edge. Round tables with snow-white linen, candelabras and clear acrylic chairs line both sides of the floor and recede toward the glass walls, soft sage-green garden beyond. White silk drapes with warm micro fairy lights curve across the ceiling. Soft diffused daylight. The foreground floor in the lower half is a calm, bright, uncluttered surface. The venue is completely empty: no people, no guests, no staff, no silhouettes. Cinematic, photorealistic, 16:9. No text, no logos, no lettering anywhere.
```

## 3. Video (Flow, imagen a video)

Pon la imagen inicial como fotograma inicial. Si Flow te deja poner también un fotograma final, usa la imagen final nueva. Si con fotograma final la imagen se deforma a mitad del plano, genera sin él y confía en el prompt. Formato 16:9, la mayor calidad disponible y la duración más larga que permita. Si puedes apagar el audio, apágalo (lo quito igualmente). Si en una sola toma no llega a recorrer todo, se encadena en dos tomas.

```
One continuous shot, no cuts. A slow, smooth crane-down combined with a long, steady pull-back. The shot starts close under the high ring of white flowers, looking along the cascade of crystal strands, and descends to eye level while pulling far back, widening into an establishing view of the whole marquee. The chandelier shrinks smoothly in the frame as the long white dance floor opens up below and ahead. Soft prismatic glints sweep across the crystals as the light shifts. The scene stays alive throughout: the crystals sway and glitter very slightly, the warm micro lights twinkle, the white silk drapes breathe in a faint breeze, soft light moves across the glossy white floor. The shot ends at rest in a wide establishing view at eye level from the near end of the long dance floor: the floral ring and the crystal chandelier small and centered in the upper middle of the frame, the glossy white floor filling the lower half and leading to a tall white wedding cake on a white pedestal at the far end, round white tables on both sides, glass walls and garden beyond. The camera comes to a complete stop. The venue is completely empty: no people, no silhouettes. No camera shake. No text, no logos, no lettering anywhere.
```

## Qué mirar al revisar lo que salga

- Que no haya personas ni siluetas, ni siquiera lejanas.
- Que no haya marcas, logos ni letras en ninguna parte.
- Que la cascada se mantenga centrada y no se deforme en la bajada.
- Que el final descanse de verdad. Si la cámara sigue moviéndose al final, no se repite: se recorta el video en el último fotograma tranquilo (el recorte de cola del skill).
- Que el suelo del final sea una superficie limpia y calma, sin objetos, donde se pueda poner texto.

## Cómo me pasas los archivos

- Imágenes: arrástralas al chat.
- Video: arrástralo al chat. Si no se deja, súbelo a la carpeta `boda-luxe-white-trabajo/raw/` de la rama `claude/funny-babbage-tzmrrp` del repositorio (el navegador de GitHub admite archivos de hasta 25 MB).
