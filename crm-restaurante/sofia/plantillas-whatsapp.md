# Plantillas de WhatsApp (para aprobar en Meta)

Fuera de la ventana de 24 horas (cuando el cliente no escribió en el último día) WhatsApp **solo** deja mandar plantillas aprobadas.
Los recordatorios casi siempre caen ahí, así que hay que aprobarlas antes de activar.

**Dónde:** Meta Business Suite → WhatsApp Manager → Plantillas de mensajes → Crear.
**Categoría:** *Utilidad* (no "Marketing": cuesta varias veces más y Meta puede reclasificarla si lleva promociones).
**Idiomas:** crear cada una en `es` y `en`.

Cada evento del módulo (`recordatorio.24h`, etc.) se conecta en n8n con su plantilla. Variables: `{{1}}`, `{{2}}`… en orden.

| Nombre | Evento del módulo | Texto (es) |
|---|---|---|
| `reserva_confirmada` | `reserva.confirmada` (solo si la reserva la creó el equipo o la web; si fue Sofía, ella ya lo dijo en el chat) | Hola {{1}}, su reserva en {{2}} está confirmada: {{3}} personas, {{4}} a las {{5}}. Código {{6}}. Si necesita cambiarla, responda a este mensaje. |
| `recordatorio_reserva` | `recordatorio.24h` | Hola {{1}}, le recordamos su reserva en {{2}} mañana {{3}} a las {{4}} para {{5}} personas. ¿Nos confirma su asistencia? Botones: **Confirmo** · **Necesito cambiarla** |
| `recordatorio_hoy` | `recordatorio.3h` | ¡Hola {{1}}! Lo esperamos hoy a las {{2}} en {{3}}. Le guardamos la mesa 15 minutos. Ubicación: {{4}} |
| `grupo_confirmado` | `reserva.confirmada` con `tipo = grupo` | ¡Hola {{1}}! Confirmamos su mesa para {{2}} personas el {{3}} a las {{4}}. Código {{5}}. ¡Los esperamos! |
| `grupo_no_disponible` | `reserva.rechazada` | Hola {{1}}, lamentablemente no podemos recibir su grupo el {{2}} a las {{3}}. Responda este mensaje y le buscamos otra opción. |
| `gracias_resena` | `post_visita.resena` | ¡Gracias por visitarnos, {{1}}! Si le gustó, nos ayuda muchísimo una reseña en Google: {{2}} |

Reglas para que Meta las apruebe rápido:
- Nada de promociones ni descuentos en plantillas de utilidad.
- Texto fijo con variables; no empezar ni terminar con una variable.
- Cuando el cliente responde a cualquier plantilla, se abre la ventana de 24 h y Sofía sigue conversando sin costo de plantilla.

**Instagram y Messenger** no usan plantillas, pero tampoco dejan escribir después de 24 h (Messenger permite una etiqueta
"actualización de evento confirmado"). Por eso, si la reserva entra por Instagram, Sofía **pide el WhatsApp** al cerrar la reserva:
"¿Me deja un WhatsApp para mandarle el recordatorio?". Así los recordatorios siempre salen por WhatsApp.
