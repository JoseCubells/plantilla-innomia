# Prompts para Google Flow

Los prompts van en inglés porque los generadores los entienden mejor. Los ajustes van en español. Todos pasan las leyes del skill: sin personas, sin texto ni logos, un solo plano, la acción en el centro y el final compuesto antes de generar.

Orden de trabajo: imagen inicial, imagen final, video. La imagen final se genera usando la inicial como referencia para que sea la misma sala.

## 1. Imagen inicial (Nano Banana Pro, 16:9, la resolución más alta que ofrezca)

```
Photorealistic luxury wedding reception inside a vast clear-roof marquee, captured as the first frame of a slow downward crane move. A monolithic suspended ring of white hydrangeas, roses and peonies hangs high across the top of the frame. From its center a tall cylindrical cascade of faceted crystal strands falls straight down the exact middle of the frame: it bisects the image, dead center, the same distance from the left edge as from the right, glittering softly. Both halves of the frame on either side of the cascade receive the identical calm treatment: long curved swags of white silk drapes with warm micro fairy lights glowing in the folds, soft and even, with no objects and no bright highlights on either side. Far below, out of focus, a spotless glossy white dance floor, round tables with snow-white linen, tall candelabra, and floor-to-ceiling glass walls showing soft desaturated sage-green garden foliage. Light: soft diffused daylight through the translucent roof, warm pinpoint fairy lights, crystal glints. Palette as materials: pure white petals, ivory silk, snow-white linen, clear crystal and glass, a trace of silvery sage green in the leaves, a hint of warm gold in the tiny lights. One continuous world filling the frame edge to edge. The venue is completely empty: no people, no guests, no staff, no silhouettes. Cinematic, photorealistic, 16:9. No text, no logos, no lettering anywhere.
```

## 2. Imagen final (Nano Banana Pro, 16:9, usando la imagen inicial como referencia)

```
Using the reference image as the exact same venue, the same marquee, the same floral ring and the same crystal chandelier, show the final resting moment of the camera move. Eye-level wide shot from the edge of the empty white dance floor. The suspended ring of white flowers and the crystal chandelier sit in the upper third of the frame, centered. The spotless glossy white dance floor fills the entire lower half of the frame as a calm, bright, softly reflective surface with a faint reflection of the chandelier light. Round tables with snow-white linen, a few tall candelabra and the floor-to-ceiling glass walls recede softly in the background, soft sage-green garden foliage beyond the glass. White silk drapes with warm micro fairy lights curve across the ceiling. Soft diffused daylight and warm pinpoint lights. Generous calm margin above and below the chandelier and across the floor. The venue is completely empty: no people, no guests, no staff, no silhouettes. Cinematic, photorealistic, 16:9. No text, no logos, no lettering anywhere.
```

## 3. Video (Flow, imagen a video)

Pon la imagen inicial como fotograma inicial. Si Flow te deja poner también un fotograma final, usa la imagen final: controlamos así cómo termina el plano. Formato 16:9, la calidad más alta disponible, la duración más larga que permita. Si puedes apagar el audio, apágalo (lo quito igualmente).

```
One continuous shot, no cuts. A slow, smooth crane-down combined with a gentle pull-back: the shot starts close on the high ring of white flowers and the crystal cascade, and descends to floor height while slowly widening the view. The cascade stays centered in the frame and slides gently upward through it as the camera lowers and moves back. Soft prismatic glints sweep across the crystals as the light shifts. The scene stays alive throughout: the crystals sway and glitter very slightly, the warm micro lights twinkle, the white silk drapes breathe in a faint breeze, soft light moves across the glossy white floor. The shot ends at rest at eye level at the edge of the empty white dance floor: the floral ring and the crystal chandelier in the upper third of the frame, centered, the spotless glossy white floor filling the lower half, round white tables and glass walls softly receding in the background. The camera comes to a complete stop. The venue is completely empty: no people, no silhouettes. No camera shake. No text, no logos, no lettering anywhere.
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
