# 1 · Ajustar el CRM a un restaurante

Un CRM de ventas piensa en "leads" y "oportunidades". Un restaurante piensa en **mesas, turnos y clientes que vuelven**.
Esta guía dice qué configurar en el CRM (bandeja omnicanal donde vive Sofía) para que hable el idioma del restaurante.
Está escrita para cualquier CRM con etiquetas, atributos de contacto, equipos y respuestas guardadas (Chatwoot, Kommo, HighLevel, etc.).

---

## 1.1 Bandejas (inboxes)

| Bandeja | Para qué | Quién atiende |
|---|---|---|
| WhatsApp (número del restaurante) | Reservas, preguntas, recordatorios | Sofía → equipo |
| Instagram DM | Reservas e info, respuestas a historias | Sofía → equipo |
| Messenger (Facebook) | Igual que Instagram | Sofía → equipo |
| Chat del sitio web | Visitantes de la web | Sofía → equipo |
| Correo (eventos@ o reservas@) | Eventos y empresas | Equipo de eventos |

## 1.2 Equipos

- **Salón / anfitrión**: reservas del día, cambios de última hora, "ya voy llegando".
- **Eventos**: grupos de 7–15 por aprobar y solicitudes de evento (más de 15 o Salón VIP).
- **Administración**: quejas, facturas, proveedores, trabajo.

## 1.3 Etiquetas (las que importan para el ROI)

| Etiqueta | La pone | Significa |
|---|---|---|
| `reserva-confirmada` | Sofía | Reserva creada y confirmada |
| `grupo-pendiente` | Sofía | Grupo 7–15, mesa apartada, el equipo debe aprobar |
| `evento-solicitud` | Sofía | Más de 15 o Salón VIP; Eventos cotiza |
| `fuera-de-horario` | Automatización | Mensaje entró fuera del horario de atención humana |
| `humano` | Sofía | Necesita una persona (queja, factura, pedido raro) |
| `info` | Sofía | Solo preguntó horario, carta, parqueo |
| `sin-disponibilidad` | Sofía | Pidió y no hubo mesa ni aceptó alternativa (demanda perdida: sirve para decidir ampliar turnos) |
| `no-show` | Módulo de reservas | No llegó |
| `vip` / `frecuente` | Equipo | Cliente a cuidar |
| `alergia` | Sofía | Tiene alergia anotada |

## 1.4 Atributos del contacto (ficha del cliente)

- Idioma (es/en)
- Fecha de cumpleaños (opcional; se pide con naturalidad en reservas de cumpleaños)
- Alergias / preferencias (terraza, mesa tranquila)
- Visitas (número) y última visita: los rellena n8n con los eventos `post_visita.resena`
- No-shows (número)
- Código de la última reserva

Con esto, en 2 meses el restaurante tiene una **base propia de clientes**. Con OpenTable, esa base queda en OpenTable.

## 1.5 Horario de atención y mensaje fuera de horario

- Horario humano: el que el equipo realmente contesta (por defecto 10:00–22:00 en `config.json → atencionHumana`).
- **Fuera de horario Sofía NO dice "estamos cerrados"**: sigue reservando. Solo lo que necesita a una persona queda para la mañana:
  "Lo dejo anotado y el equipo le escribe mañana a partir de las 10 a.m."

## 1.6 Respuestas guardadas para el equipo

| Atajo | Texto |
|---|---|
| `/grupo-ok` | ¡Confirmado! Los esperamos el {fecha} a las {hora}, {personas} personas. Cualquier cambio, por aquí. |
| `/grupo-menu` | Para grupos tenemos menú para compartir desde ${precio} por persona. ¿Le mando la propuesta? |
| `/lleno` | Ese horario ya está completo. ¿Le sirve {alternativa}? |
| `/parqueo` | Tenemos parqueo en Plaza 300, Avenida Escazú. |
| `/evento` | Para su evento necesito: fecha, número de invitados, tipo de evento y presupuesto por persona. |

## 1.7 Flujos automáticos (n8n o automatizaciones del CRM)

1. **Conversación nueva fuera de horario** → etiqueta `fuera-de-horario`.
2. **Evento `grupo.pendiente_aprobacion`** → aviso al equipo Eventos (WhatsApp interno o notificación del CRM) con link al panel.
3. **Evento `grupo.aprobacion_vencida`** → recordatorio al encargado: "Hay un grupo esperando respuesta desde ayer".
4. **Evento `reserva.confirmada` de un grupo aprobado** → plantilla `grupo_confirmado` al cliente.
5. **`recordatorio.24h` / `recordatorio.3h`** → plantillas de recordatorio por WhatsApp.
6. **`post_visita.resena`** → plantilla `gracias_resena` + suma 1 a "Visitas" en la ficha.
7. **`reserva.no_show`** → suma 1 a "No-shows"; con 2 o más, Sofía pide confirmación extra en la próxima reserva.

## 1.8 Lo que el anfitrión hace cada día (5 minutos)

- **Mañana (10:00)**: abrir el panel → *Por aprobar* → aprobar o rechazar grupos. Revisar la etiqueta `humano`.
- **Durante el servicio**: marcar **Llegó** / **No vino** en la agenda (tablet en la entrada). Sin esto no hay métrica de no-show.
- **Reservas por teléfono o en persona**: cargarlas en el panel → *Nueva* (si no, Sofía puede vender esa mesa dos veces).
