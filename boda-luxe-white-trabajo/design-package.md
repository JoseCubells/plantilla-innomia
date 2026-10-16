# Paquete de diseño: Boda Luxe White

Plantilla de boda "Luxe Monochromatic White". Pareja inventada, sin personas en el video, hecha para cambiar los datos y reutilizarla en cualquier boda. Nivel 1 (un solo plano continuo). Las imágenes y el video se generan en Google Flow (Nano Banana Pro para imágenes, el modelo de video de Flow para el plano). Este documento NO se publica: vive fuera de la carpeta `boda-luxe-white/`.

Cada línea de texto de este paquete se publica tal cual. Los números de bandas y pacing son puntos de partida que el flick test valida después.

## 0. Datos de la plantilla (lo que se cambia por boda)

Todo esto vive en un único bloque `WEDDING` al inicio del script de `index.html`, marcado con un comentario. Cambiar la boda es cambiar ese bloque.

| Dato | Valor de muestra |
|---|---|
| Pareja | Valeria & Alejandro |
| Monograma | V & A |
| Fecha larga | 12 de junio de 2027 |
| Fecha corta | 12 · 06 · 2027 |
| Lugar | Finca Los Almendros |
| Dirección | Camino de los Almendros, s/n |
| Enlace del mapa | `#` (se sustituye por el enlace real) |
| WhatsApp | `#` (se sustituye por el enlace real) |
| Fecha límite de respuesta | 1 de mayo de 2027 |
| Modo del formulario | `demo` (ver sección 6, formulario) |

## 1. La idea central

Una araña de cristal no brilla sola: son cientos de cristales que se reparten la luz. Esta boda funciona igual. Cada invitado es un cristal, y la sala se enciende cuando todos están colgados en su sitio. Toda la web enseña esa idea y vende una sola acción: confirmar asistencia, que es encender tu cristal. Lo que no sirve a esa idea no entra.

## 2. Paleta (tokens CSS, valores provisionales)

Dirección: blanco porcelana, marfil, cristal, un verde plata apagado del follaje y negro tinta solo para el botón, como el smoking. Los valores finales se afinan con el video aprobado, y todo el contraste se calcula en la construcción, no se adivina.

```css
:root{
  --canvas:#F3F1EC;         /* porcelana, nunca blanco puro */
  --panel:#FAF8F4;          /* superficies elevadas, nieve */
  --accent:#17161A;         /* tinta del smoking: botón y énfasis raro */
  --accent-hover:#34323A;
  --accent-muted:#9CA89B;   /* verde plata apagado: bordes finos, hilos, destellos */
  --line-strong:#6F7B6E;    /* borde de controles interactivos (3:1 mínimo, se verifica) */
  --light-warm:#F1DDB0;     /* las luces cálidas de la carpa, solo motas y brillos */
  --text-secondary:#5B5953;
  --text-primary:#1B1A1E;
}
```

Como el mundo es blanco, el sistema de legibilidad del skill se invierte: texto en tinta oscura sobre velos claros, y la auditoría del peor fotograma busca el píxel MÁS OSCURO bajo el texto, no el más claro.

## 3. Tipografía

- **Display:** Bodoni Moda, 400 y 400 cursiva. Para nombres, titulares y cifras grandes. Alto contraste de alta costura.
- **Texto:** Jost, 300 y 400. Geométrica y callada.
- **Etiquetas pequeñas:** DM Mono, 400. Horas, números de sección, notas.

Solo esos pesos, con `preconnect`. Ni Inter ni Roboto.

## 4. El video y el plano (storyboard del nivel 1)

Un solo plano continuo, sin cortes, sin personas. Se descarta cualquier transformación.

**Capítulo único: El descenso.**
- **El mundo:** carpa de cristal blanca. Corona de flores blancas suspendida en lo alto, con una cascada cilíndrica de cristal cayendo por el centro. Telas de seda drapeadas con microluces cálidas. Muros de cristal con follaje verde plata desaturado al fondo. Pista blanca impecable.
- **El movimiento:** grúa lenta hacia abajo (de la altura del techo a la altura del suelo). La cascada queda centrada y se desliza hacia arriba por el encuadre. Empuje casi imperceptible hacia dentro.
- **El cruce:** a media bajada, los hilos de cristal exteriores pasan cerca de la lente: destellos suaves, un instante de desenfoque con bokeh, y se despeja.
- **La vida del plano:** los cristales oscilan y brillan muy poco, las microluces titilan, las telas respiran, la luz se mueve sobre el suelo brillante.
- **El fotograma final (reposo):** altura de ojos, al borde de la pista vacía. La corona y la araña quedan en el tercio superior, centradas. El suelo blanco brillante llena la mitad inferior y es la zona calma donde vive el texto del cierre. Mesas redondas y muros de cristal se alejan suaves al fondo.
- **Dónde vive el texto:** durante el descenso, el carril central es la acción y las palabras van a izquierda y derecha. Al final, el texto va sobre el suelo blanco, en el centro inferior.

Los prompts exactos para Flow están en `prompts-flow.md`.

## 5. Mapa de bandas del hero

Hero de 600vh (rango de scroll de 500vh). El nivel 1 por defecto es 400vh, pero con cuatro frases cada una necesita su meseta de lectura, y se ajusta con el flick test. Rampas de 20vh = 0,04 de progreso.

| Banda | Rango | El video está haciendo | Texto (literal) | Entrada |
|---|---|---|---|---|
| 1 | 0,00 a 0,22 | Bajo la corona de flores, la cascada empieza a deslizarse | "Valeria & Alejandro" y la etiqueta "12 · 06 · 2027" | Caída suave de palabras (drift-down) |
| 2 | 0,26 a 0,50 | Bajada junto a la cascada, los hilos brillan | "Una araña no brilla sola." y debajo "Son cientos de cristales repartiéndose la luz." | Dispersión de letras que se reúnen (scatter) |
| 3 | 0,54 a 0,78 | Los hilos rozan la lente, bokeh, y la sala se abre | "Cada invitado es un cristal." y debajo "Tú eres uno de ellos." | Dos mitades que se separan (halves parting) |
| 4 | 0,82 a 1,00 | Reposo sobre la pista blanca | "Enciende el tuyo." y debajo "12 de junio de 2027 · Finca Los Almendros", botón "Confirmar asistencia" | Palabras que suben, luego subtítulo, luego botón |

Colocación: bandas 1 y 3 a la izquierda, banda 2 a la derecha, carril central libre. Banda 4 centrada sobre el suelo.

## 6. Hero estático (móviles y movimiento reducido)

Sobre el fotograma final del video, compuesto con el texto visible:
- Titular: "Valeria & Alejandro"
- Línea: "12 de junio de 2027 · Finca Los Almendros"
- Botón: "Confirmar asistencia"

Por defecto el móvil ve este hero estático. Se estudia un scrub recortado a vertical solo si el video final pesa menos de 8 MB, el carril central sobrevive al recorte y se prueba en un teléfono real.

## 7. Lo que hay debajo del hero (texto literal)

Todo desemboca en un único botón: Confirmar asistencia.

**Navegación:** monograma "V & A". Enlaces: "Historia", "El día", "Dónde", "Dudas". Botón: "Confirmar asistencia".

**01 · Nosotros** (etiqueta "01 · Nosotros")
- Titular: "Dos hilos, un solo cristal."
- Texto: "Nos conocimos en una boda ajena, junto a la barra, discutiendo por la última croqueta. Cinco años después, él se puso de rodillas en esa misma sala. Ella dijo que sí antes de que terminara la pregunta."
- Cita: "Lo mejor de una fiesta es mirar alrededor y ver a todos los que quieres en el mismo sitio."
- Firma de la cita: "Valeria y Alejandro"
- Motivo: dos hilos que se dibujan al hacer scroll y se juntan en un cristal.

**02 · El programa** (la jugada interactiva vive aquí)
- Titular: "Una noche para encender."
- Instrucción del botón: "Mantén pulsado para encender la noche"
- Estado al completar: "La noche está encendida."
- Cada momento, con una hora, un nombre y una línea:
  - 17:30 · "Llegada" · "Te recibimos con una copa y música en directo."
  - 18:00 · "Ceremonia" · "Bajo la corona de flores. Dura menos de cuarenta minutos."
  - 19:00 · "Cóctel" · "En el jardín, con el sol bajo."
  - 20:30 · "Cena" · "Mesas redondas bajo la araña."
  - 23:00 · "Baile" · "La pista blanca es para estrenarla."
  - 02:00 · "Final" · "Hay autobuses de vuelta a la ciudad cada hora."
- Jugada: un hilo vertical con seis cristales. Al mantener pulsado, el progreso sube y los cristales se encienden en orden, y cada momento aparece con su luz. Soltar antes baja el progreso con suavidad, nunca de golpe. Con movimiento reducido, todo aparece ya encendido y no hace falta mantener nada.

**03 · El lugar**
- Titular: "La Carpa de Cristal, en la Finca Los Almendros."
- Texto: "A treinta y cinco minutos de la ciudad, entre almendros y caminos de grava blanca."
- Dirección: "Camino de los Almendros, s/n"
- Botón: "Cómo llegar"
- Aparcamiento: "Gratis en la finca. Hay personal que te indica dónde dejar el coche."
- Autobús: "Salidas desde la plaza Mayor a las 16:45 y a las 17:15. Vuelta cada hora desde las 23:00."
- Alojamiento: "Hotel Cristal Garden, a seis minutos. Pregunta por la tarifa Valeria y Alejandro."
- Imagen: el fotograma final del video, a todo ancho.

**04 · Dudas** (acordeón, cada respuesta corta)
- "¿Qué me pongo?" → "Etiqueta, black tie. Te pedimos que el blanco quede para la novia. El jardín es de grava y césped, así que los tacones finos sufren."
- "¿Puedo llevar a mis hijos?" → "Es una noche de adultos. Habrá una sala con cuidadoras para los más pequeños hasta las 22:00. Cuéntanos cuántos son al confirmar."
- "¿Puedo cambiar mi respuesta?" → "Sí, las veces que haga falta hasta el 1 de mayo. Vuelve a esta página y usa Cambiar mi respuesta."
- "Tengo una alergia o una dieta especial." → "Escríbela al confirmar. El menú tiene opción vegetariana, sin gluten y sin lactosa, y la cocina lo prepara aparte."
- "¿Qué regalo puedo hacer?" → "Que vengas ya es el regalo. Si quieres añadir algo, hay una mesa pequeña de regalos."
- Enlace de la respuesta de regalos: "Ver la mesa de regalos"
- "¿Hasta cuándo puedo confirmar?" → "Hasta el 1 de mayo de 2027. Si se te pasa, escríbenos por WhatsApp."

**05 · Tu cristal** (el cierre, id `confirmar`)
- Titular: "Enciende el tuyo."
- Texto: "Escribe tu nombre como quieras, sin buscarlo en ninguna lista. Podrás cambiar tu respuesta cuando quieras."
- Campos: "Tu nombre" (ayuda: "Como te llamamos en casa") · "¿Vienes?" con "Sí, allí estaré" y "No podré ir" · "¿Cuántos sois?" (ayuda: "Contándote a ti", solo si dice que sí) · "Alergias o dieta" (ayuda: "Sin gluten, vegetariano, alergia a los frutos secos") · "Un mensaje para nosotros" (opcional)
- Botón: "Confirmar asistencia"
- Alternativa: "¿Prefieres escribirnos? Por WhatsApp"
- Errores: "Escribe tu nombre para continuar." y "Elige una opción."
- Éxito, si viene: "Tu cristal ya brilla, {nombre}." y "Te esperamos el 12 de junio. Si algo cambia, vuelve aquí." con el botón "Cambiar mi respuesta"
- Éxito, si no viene: "Te echaremos de menos, {nombre}." y "Gracias por avisarnos. Si algo cambia, aquí seguimos." con el botón "Cambiar mi respuesta"

**A dónde va el formulario.** Es una web estática, sin servidor. El modo por defecto es `demo`: el formulario muestra su mensaje de éxito y la respuesta no llega a nadie. Está pensado para la plantilla de muestra. Para una boda real el bloque `WEDDING` admite tres modos más: `mailto` (se abre el correo del invitado ya dirigido a la pareja), `endpoint` (el formulario envía a un servicio gratuito de formularios, como Formspree, y las respuestas llegan al correo de la pareja) y `whatsapp` (se abre un mensaje ya escrito). El mensaje de éxito siempre dice la verdad sobre lo que ocurrió.

**Pie de página**
- Monograma "V & A"
- "12 · 06 · 2027 · Finca Los Almendros"
- Aviso: "Plantilla de muestra. Valeria, Alejandro y la Finca Los Almendros son inventados, y las imágenes están generadas con IA."

## 8. La capa de vectores

Todo respeta el movimiento reducido: estados finales a la vista y motores parados.

- **Telón de cristal (el elemento propio).** Capa fija detrás de todo lo que va debajo del hero. Unos 120 hilos finos cuelgan del borde superior de la pantalla, cada uno con una a tres cuentas diminutas. Oscilan muy despacio (ciclos de 70 a 110 segundos, con retardos negativos para que arranquen a medio ciclo). A medida que la página avanza, más cuentas se encienden, en ocho niveles. Al llegar a la confirmación el telón alcanza su máximo, y al enviar la respuesta se enciende "tu cristal" con una luz más cálida. Es el ambiente fijo y es la firma a la vez. Solo se anima con transform y opacity.
- **Motas de luz cálida.** Unas quince, a nivel de susurro, subiendo muy despacio (ciclo de 90 segundos).
- **Divisores.** Una línea fina que se dibuja (scaleX) con un cristal facetado pequeño en el centro.
- **Dos hilos de la historia.** Dos trazos que se dibujan con el scroll y se juntan en un cristal. Los trazos curvos se dibujan con dashoffset, lo único que no es transform u opacity, y es pequeño.
- **El hilo del programa.** Una línea vertical que se dibuja (scaleY) con seis cristales.
- **El cristal de la confirmación.** Un glifo que se enciende al enviar.

## 9. Lista de ingeniería

Se aplica todo el estándar de `references/scrub-pipeline.md`: carga del video como Blob con anillo de progreso, lerp normalizado por dt, seeks con compuerta, escrituras al DOM solo si hay cambio, bandas medidas en vh con flick test, legibilidad en cuatro capas (en su versión invertida: velos claros y texto oscuro), las cinco condiciones del hero estático vivas con listeners de cambio, página completa sin video, movimiento reducido en ambos sentidos, `overflow-x: clip` en html y body, y el suelo de calidad entero. Más el estándar de web animada completa de la Fase 8: una entrada distinta por momento, una pieza viva por sección, todo suavizado.

## 10. La puerta del texto

Todo el texto de arriba se publica literal. La página construida pasa la puerta de la Fase 9 antes de que nadie la vea: cero guiones largos, cero palabras de relleno (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions) y el barrido del texto buscando tics de IA. Los recursos de marca de este paquete, como el triplete "Una araña no brilla sola" o la repetición de "cristal", son decisión de diseño y se quedan.
