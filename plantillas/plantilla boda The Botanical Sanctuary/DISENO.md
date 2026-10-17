# The Botanical Sanctuary · Paquete de diseño

Plantilla de web inmersiva para bodas. Un invernadero de hierro y cristal en una finca europea, a la hora dorada. El visitante recorre la boda con el scroll: el sendero, la mesa, el altar y la velada.

Este documento es la entrada de la construcción. Cada línea de texto marcada como copy se publica tal cual. Los rangos de las bandas son puntos de partida y los valida la prueba de flick (ver `references/scrub-pipeline.md`).

Nombres, fecha, lugar, hoteles e IBAN son de ejemplo. Se cambian en `web/index.html` (y la fecha también en la configuración `window.SANCTUARY`).

---

## 0. Decisiones que se apartan del skill (dichas en voz alta)

- **Imágenes y vídeo: Google Flow y Nano Banana Pro, no Higgsfield.** Lo genera todo el autor de la plantilla. El skill sigue mandando en todo lo demás: leyes de prompt, puertas de revisión, encode de scrub, estándar de ingeniería. El pack de prompts está en `PROMPTS.md`.
- **Tier 2 con fotogramas clave.** Cuatro capítulos, cuatro segmentos de vídeo. En vez de encadenar "último fotograma del clip N como inicio del clip N+1", se generan primero cinco fotogramas clave con Nano Banana Pro (K0 a K4) y Flow genera cada segmento con "Frames to Video" (inicio y final fijados). Las uniones caen siempre en una imagen idéntica a ambos lados, así que la ley de la costura (la textura no se hereda) queda neutralizada.
- **Las cinco puertas del hero estático viven en un solo sitio.** Un script en el `<head>` evalúa las cinco media queries antes del primer pintado y pone `html.scrub` o `html.static`. El CSS sigue a esa clase y el JS lee la misma lista, así que no pueden desalinearse nunca. Ventaja extra: sin JavaScript la página se ve en su versión estática, completa.
- **La web funciona hoy, sin ningún asset.** Mientras no existan las imágenes y el vídeo, cada capítulo pinta una escena atmosférica dibujada en SVG (luz dorada, sendero, mesa, arco, velas) que se desplaza con el scroll. Cuando se añaden los archivos, la escena dibujada queda debajo como red de seguridad.

## 1. La premisa

**Una idea: la luz.** Todo el día de la boda es un recorrido de luz: la tarde dorada que entra entre las hojas, la luz que se parte en las copas estriadas, el sol bajo que alarga las sombras del arco y, al final, cientos de velas cuando se va el día. La web enseña esa idea capítulo a capítulo y termina con un gesto: el invitado confirma su asistencia encendiendo su propia vela. Cada sección sirve a eso. Lo práctico (cómo llegar, dónde dormir, preguntas) va después, en un "cuaderno de campo" de papel de lino.

**Elemento firma:** la vela del invitado. En la Lámina IV las velas de la escena se encienden con el scroll, y el botón de confirmación se mantiene pulsado para encender una más: la tuya. Si se quitase, la página perdería su final y su sentido.

**Sistema de motivos:** láminas de herbario. Cada capítulo es una lámina numerada (Lámina I a IV) con su etiqueta en mono y su nombre botánico, y las secciones prácticas siguen la numeración (Nº 05 en adelante) como entradas de un cuaderno de campo.

## 2. Paleta (tokens CSS)

Sacada del mundo del storyboard: lino crudo, eucalipto, olivo, rosa empolvado, luz dorada y la penumbra azul verdosa de la velada. Se afinará con los fotogramas reales cuando pase la puerta de vídeo.

```css
:root{
  --linen:#ECE5D8;      /* lienzo del cuaderno de campo: lino crudo, nunca blanco puro */
  --paper:#F6F1E8;      /* tarjetas de papel de algodón */
  --linen-hi:#F4EFE6;   /* texto sobre la escena */
  --ink:#283024;        /* texto principal sobre lino (10.9:1) */
  --ink-2:#565D4D;      /* texto secundario sobre lino (5.46:1) */
  --rule:#7A6F62;       /* bordes interactivos sobre lino (3.92:1) */
  --sage:#8E9C88;       /* eucalipto */
  --olive:#5E6748;
  --gold:#D8B477;       /* la luz, nunca como acento */
  --night:#141A1C;      /* la velada: penumbra verde azulada, nunca negro puro */
  --accent:#8A554D;     /* rosa empolvado profundo: CTA, foco, la vela (texto lino 5.26:1) */
  --accent-hover:#9E655C;
  --accent-muted:#C9A39A; /* rosa empolvado a nivel susurro */
}
```

Nota sobre los looks vetados: "lienzo crema con serif y acento terracota" está en la lista de clichés. Aquí el lino crudo es literalmente el material del encargo, así que se aplica la excepción del skill. Para ganárnosla: el acento es rosa empolvado (de las rosas del sendero), el elemento firma es propio y la maquetación del cuaderno no repite la plantilla típica.

## 3. Tipografía

- **Display: IM Fell English** (regular e itálica). Es la letra de los libros de botánica impresos en tipos móviles: herbario, papel de algodón, Europa antigua. Carácter de verdad, nada de Inter ni Roboto.
- **Texto: Albert Sans** 300, 400 y 500. Tranquila y clara a tamaño pequeño.
- **Mono: DM Mono** 400, para las etiquetas de lámina, horarios y nombres botánicos.

## 4. Mapa de bandas del hero (scroll de 1300vh, recorrido de 1200vh)

Capítulos en progreso de scroll: I 0 a 0.25, II 0.25 a 0.55, III 0.55 a 0.80, IV 0.80 a 1. El vídeo se mapea por tramos: cada frontera de capítulo cae exactamente en la unión entre segmentos (configurable en `chapterTimes`).

| Banda | Rango | Momento del metraje | Copy (tal cual) | Entrada |
|---|---|---|---|---|
| 1 | 0.00 a 0.11 | Cámara rasante al inicio del sendero de piedra, hojas moviéndose | Etiqueta: "Lámina I · El umbral" · Título: "Clara & Mateo" · Subtítulo: "Nos casamos el 19 de junio de 2027 · Finca El Olivar, Aranjuez" | Subida palabra a palabra con giro leve (abre ya montada con rampa de carga) |
| 2 | 0.125 a 0.24 | El travelling avanza entre eucalipto, olivo y rosas | "Un sendero de piedra antigua, olivos a los lados." / "Al final, te esperamos nosotros." | Brisa: las letras llegan girando desde un lado, como hojas que se posan |
| 3 | 0.255 a 0.37 | La toma desciende y entra a lo largo de la mesa imperial | Etiqueta: "Lámina II · La mesa imperial" · "Una sola mesa. Todos bajo la misma luz." | Alineación a rejilla: las letras se deslizan en orden de lectura, como el travelling por la mesa |
| 4 | 0.38 a 0.545 | Avance por la mesa: copas estriadas, cerámica, lino, menús | Tarjeta "El día": 17:30 Ceremonia bajo el arco · 18:30 Cóctel entre los olivos · 21:00 Cena en la mesa imperial · 23:30 La velada: velas, música y baile · 03:00 Último autobús a Madrid. Tarjeta "Etiqueta de jardín": "Tonos de la finca: lino, salvia, oliva, arena y rosa empolvado." · "Tacón ancho o plano: el suelo es de piedra." · "Una capa para la noche, que en el campo refresca." · "El blanco y el marfil, mejor para nosotros." | Vidrio: las tarjetas flotan desde los lados y la línea del horario se dibuja |
| 5 | 0.555 a 0.67 | Aproximación al arco floral, sombras largas en la piedra | Etiqueta: "Lámina III · El altar" · "Nos casamos bajo el arco, a las 17:30." · "A esa hora el sol entra de lado y alarga las sombras sobre la piedra." | Sombra larga: una sombra estirada del texto se recoge hasta convertirse en letra |
| 6 | 0.68 a 0.795 | Cámara casi bajo el arco, destello de sol | "Seis años, dos ciudades y un olivo en el balcón." / "Ahora, este arco." | De desenfocado a nítido, como el sol que entra en foco |
| 7 | 0.81 a 1.00 | Penumbra, se encienden las velas en fanales, viñeteado | Etiqueta: "Lámina IV · La velada" · "Cuando caiga la luz, quédate." + módulo RSVP | Subida en tres tiempos: título, tarjeta, botón. Velas encendiéndose de 0.80 a 0.94 |

Mesetas: entre 90vh y 170vh por banda, rampas de unos 24vh. Validado con la prueba de flick: cada banda aguanta 6 o más pasos de rueda normales (120px) y ninguna se salta a 360px. La penumbra (`--dusk`) va de 0.76 a 0.90.

## 5. Hero estático (móvil, tablet en vertical, movimiento reducido)

Los mismos cuatro capítulos, uno detrás de otro, cada uno a pantalla completa con su imagen (o su escena dibujada) y todo el texto ya montado. La Lámina IV termina en el formulario. No se descarga ningún vídeo.

## 6. Debajo del hero: el cuaderno de campo

1. **Entrada** · "Cuaderno de campo" · "Cómo llegar, dónde dormir y lo que suelen preguntarnos. Todo en un sitio."
2. **Nº 05 · De cerca** · "Lo hemos elegido todo a mano." · "La vajilla la hizo un pequeño taller de cerámica. Las servilletas las atamos nosotros, una a una, con hilo crudo." Tres figuras: "Copa de cristal estriado", "Cerámica mate hecha a mano", "Menú en papel de algodón". Sin fotos se muestran dibujos de cuaderno.
3. **Nº 06 · El lugar** · "Finca El Olivar" · "Un invernadero de hierro y cristal de 1890, rodeado de olivos centenarios, a diez minutos de Aranjuez." Dirección y tres formas de llegar. Mapa dibujado cuya ruta se traza con el scroll.
4. **Nº 07 · Dónde dormir** · "Tres sitios cerca, con tarifa para invitados." Tres tarjetas con lámina botánica: Hotel Jardín del Tajo, Casa Palacio de la Reina, Posada Las Huertas.
5. **Nº 08 · Un detalle** · "Lo que más nos importa es que vengas." · IBAN con botón Copiar.
6. **Nº 09 · Preguntas** · tacones, lluvia, niños, frío, fotos, plazo.
7. **Cierre** · cuenta atrás "Faltan N días para encender las velas." · "Te guardamos un sitio en la mesa." · botón "Confirmar asistencia".
8. **Pie** · nombres, fecha, hashtag y aviso: "Plantilla The Botanical Sanctuary de Innomia. Nombres, lugar e imágenes son de ejemplo."

**Una sola llamada a la acción:** confirmar asistencia. Todos los botones "Confirmar" llevan al módulo de la Lámina IV.

**El momento interactivo:** mantener pulsado para encender tu vela. El progreso crece mientras pulsas, si sueltas antes vuelve suave hacia cero, al completar se envía la confirmación, tu vela se enciende y la escena responde con un destello de velas. Teclado y lectores de pantalla confirman con una pulsación normal. Con movimiento reducido es un botón normal.

**Formulario en una web estática:** por defecto muestra el estado de agradecimiento y no envía nada a ningún sitio (modo demo). Para una boda real se pone en la configuración un endpoint de Formspree (`rsvpEndpoint`) o un correo (`rsvpEmail`, abre el correo del invitado).

## 7. Capa vectorial

- Ramas de eucalipto y olivo en primer plano (SVG generado con semilla), desenfocadas por profundidad, que se mecen con la velocidad del scroll (muelle amortiguado) y se retiran al salir de la Lámina I.
- Polen dorado en la luz que, con la penumbra, se convierte en brasas que suben (canvas a nivel susurro).
- Velas: bokeh en primer plano siempre; además, filas de velas en perspectiva sobre la escena dibujada.
- Escenas dibujadas por capítulo (respaldo sin assets).
- Ruta del mapa que se traza con el scroll, dibujos de cuaderno, láminas botánicas de los hoteles, pétalo que flota en "Un detalle".
- Capa de entorno fija: grano de lino y una luz suave que deriva en 90 segundos.

Movimiento reducido: todo en su estado final, ningún bucle ni motor JS activo.

## 8. Lista de ingeniería

Blob en streaming con anillo de carga y watchdog, lerp normalizado por dt, seeks con compuerta, escrituras al DOM solo con cambios, bandas medidas en vh con prueba de flick, sistema de legibilidad de cuatro capas, las cinco puertas vivas con listeners, completa sin vídeo, suelo de calidad (`references/scrub-pipeline.md`) y el estándar de toda la web animada.

## 9. La puerta del copy

Todo el texto de arriba se publica tal cual. Antes de enseñarlo: cero rayas largas y cero palabras de relleno corporativo en `index.html`, y un repaso de muletillas de IA en el texto largo. Los recursos de marca de este paquete ("Una sola mesa. Todos bajo la misma luz.") son intencionados y se quedan.
