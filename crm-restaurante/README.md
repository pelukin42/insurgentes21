# CRM omnicanal para restaurantes · Sofía + reservas propias

Paquete para el piloto de 30–60 días con Insurgentes 21, reutilizable con otros restaurantes.
**Problema que resuelve:** los mensajes que entran de noche (12 a.m.) no se contestan y esa mesa se pierde.
**Solución:** Sofía contesta 24/7 y **reserva de verdad** en un sistema propio, sin OpenTable de por medio.

## Orden de trabajo

| # | Qué | Dónde |
|---|---|---|
| 1 | Ajustar el CRM a restaurante (bandejas, etiquetas, ficha del cliente, flujos) | [`guias/01-ajuste-crm-restaurante.md`](guias/01-ajuste-crm-restaurante.md) |
| 2 | Módulo de reservas (API + panel del equipo + página pública) | [`reservas/`](reservas/) |
| 3 | Conectar Sofía: herramientas, instrucciones y plantillas de WhatsApp | [`sofia/`](sofia/) |
| 4 | Instalar: primero tu demo, después el restaurante | [`guias/02-instalacion-e-integracion.md`](guias/02-instalacion-e-integracion.md) |
| 5 | Guía para quien maneja redes y lo digital | [`guias/03-guia-redes-sociales.md`](guias/03-guia-redes-sociales.md) |
| 6 | Requerimientos técnicos y costos mensuales | [`guias/04-requerimientos-tecnicos-y-costos.md`](guias/04-requerimientos-tecnicos-y-costos.md) |
| 6b | **Conectar al CRM AxelSites** (opción A del piloto + las 4 herramientas de Sofía) | [`guias/06-conectar-crm-axelsites.md`](guias/06-conectar-crm-axelsites.md) |
| 6c | **Instalar el piloto con Coolify** (copia del CRM + módulo de reservas, sin SSH) | [`guias/07-instalar-con-coolify.md`](guias/07-instalar-con-coolify.md) |
| 7 | Ahorro vs. OpenTable + calculadora | [`guias/05-ahorro-vs-opentable.md`](guias/05-ahorro-vs-opentable.md) · [`guias/calculadora-opentable.html`](guias/calculadora-opentable.html) |

## Probarlo ya (10 minutos)

```bash
cd crm-restaurante/reservas
```

```bash
npm run demo
```

Panel en http://localhost:3100/panel (llave `demo-demo-demo-demo-demo-demo`), reserva pública en http://localhost:3100/reservar.
Requiere Node.js 22.13+. No hay que instalar dependencias.

## Qué hace el módulo de reservas

- **Disponibilidad real** por mesas, turnos y duración según el tamaño del grupo; une mesas para grupos.
- **Reglas por tipo**: 1–6 personas se confirman solas; 7–15 quedan apartadas y el equipo aprueba; más de 15 o Salón VIP = solicitud de evento.
- **Nunca dice "no hay" sin alternativa**: devuelve los horarios más cercanos y el día siguiente.
- **Recordatorios** 24 h y 3 h antes, y **pedido de reseña** después de la visita (eventos que n8n convierte en plantillas de WhatsApp).
- **Métricas de ROI**: reservas y comensales fuera de horario, por canal, quién la hizo (Sofía, web, equipo), no-shows, grupos y eventos.
- Sin dependencias: Node 22 + SQLite (un archivo). Docker + Caddy para HTTPS.

Configuración del restaurante (mesas, horario, reglas, ticket promedio): `reservas/config.json`.
**Las mesas del archivo son un ejemplo**: reemplazarlas con el plano real antes del piloto.

## API (resumen)

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/disponibilidad?fecha=AAAA-MM-DD&personas=N` | Horarios libres |
| POST | `/api/reservas` | Crear (Sofía o equipo) |
| GET | `/api/reservas?fecha=` · `?telefono=` | Agenda del día / reservas de un cliente |
| GET | `/api/reservas/pendientes` | Grupos y eventos por aprobar |
| POST | `/api/reservas/{codigo}/{aprobar\|rechazar\|cancelar\|sentar\|completar\|no_show}` | Cambiar estado |
| GET | `/api/metricas?desde=&hasta=` | Números del reporte de ROI |
| GET | `/api/eventos?desde_id=` | Eventos (si no se usa webhook) |
| POST | `/crm/{consultar_disponibilidad\|crear_reserva\|buscar_reservas\|cancelar_reserva}` | Herramientas del CRM AxelSites (cabecera `X-Omnicanal-Token`, secretos en `CRM_TOKENS`) |
| GET/POST | `/public/info` · `/public/disponibilidad` · `/public/reservas` · `/public/reservas/{codigo}/cancelar` | Página pública (sin llave, con límite por IP) |

Todo `/api/*` requiere `Authorization: Bearer <API_KEY>`.
