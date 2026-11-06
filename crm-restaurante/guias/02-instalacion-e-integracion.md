# 2 · Instalación e integración, paso a paso

Orden recomendado: **primero lo instalás vos (AxelSites) como demo**, después lo clonás para el cliente.
Así llegás a la reunión de cierre con el sistema funcionando y sin riesgo para el restaurante.

```
Etapa A  Tu computadora ─ demo local (10 min)
Etapa B  Tu VPS AxelSites ─ demo en línea con tu propia Sofía (1 tarde)
Etapa C  VPS del restaurante ─ piloto real 30–60 días (1 semana)
```

---

## Etapa A · Demo en tu computadora

Requisito: Node.js 22.13 o más nuevo (`node -v`).

```bash
cd crm-restaurante/reservas
```

```bash
npm run demo
```

- Panel: http://localhost:3100/panel · llave `demo-demo-demo-demo-demo-demo`
- Página pública de reserva: http://localhost:3100/reservar
- Trae 3 semanas de reservas inventadas para que la pestaña **Resultados** muestre cómo se ve el ROI.
- Pruebas automáticas: `npm test`.

## Etapa B · Demo en tu propio VPS (AxelSites)

Ya tenés un CRM con Sofía. El módulo de reservas se instala **al lado**, en el mismo VPS, en un subdominio
(ej. `reservas.axelsites.com`) y Sofía lo usa como herramienta.

1. **DNS**: registro `A` de `reservas.axelsites.com` → IP del VPS.
2. **Docker** (si el VPS no lo tiene):
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
3. **Subir la carpeta** `crm-restaurante/reservas` al VPS (git clone del repo o `scp`).
4. **Configurar**:
   ```bash
   cp .env.example .env
   ```
   ```bash
   openssl rand -hex 24
   ```
   Pegá el resultado en `API_KEY=` y poné tu subdominio en `DOMINIO=`. Editá `config.json` (mesas, horario).
5. **Levantar**:
   ```bash
   docker compose up -d --build
   ```
   Si el VPS **ya tiene** Nginx o Caddy en los puertos 80/443 (por el CRM), no levantes el servicio `caddy` del compose:
   publicá el puerto (`ports: ["127.0.0.1:3100:3100"]` en `reservas`) y agregá un bloque de proxy a `localhost:3100` en tu Nginx/Caddy.
6. **Probar**: `https://reservas.axelsites.com/salud` debe responder `{"ok":true,...}`.
7. **Conectar a Sofía** (ver 2.2).

## Etapa C · Instalación para el restaurante

Mismo procedimiento que la etapa B, pero en **un VPS a nombre del restaurante** (así lo dice la cotización CT-02:
servidor propio, datos del restaurante). Checklist:

| # | Tarea | Quién | Tiempo |
|---|---|---|---|
| 1 | Plano real de mesas, turnos, duración por tamaño, reglas (cuántos auto-confirma) | Dueño + vos | 1 h en el local |
| 2 | Crear VPS y subdominio `reservas.` en el dominio del restaurante | Vos | 30 min |
| 3 | Instalar CRM (si es otro VPS) + módulo de reservas | Vos | 2–3 h |
| 4 | Verificar el negocio en Meta Business y conectar WhatsApp Cloud API | Vos + dueño (acceso admin) | 1–5 días por verificación |
| 5 | Conectar Instagram y Messenger | Encargado de redes (guía 3) | 30 min |
| 6 | Enviar plantillas de WhatsApp a aprobación | Vos | 1 h + 1–2 días de Meta |
| 7 | Cargar a Sofía: carta, horario, políticas, bloque de reservas | Vos | 3 h |
| 8 | 30–40 conversaciones de prueba (individual, lleno, grupo, evento, cancelación, inglés) | Vos | 2 h |
| 9 | Capacitación al anfitrión: panel, aprobar grupos, Llegó/No vino | Vos | 45 min |
| 10 | Semana 1 supervisada: el equipo revisa cada reserva de Sofía | Equipo | — |
| 11 | Línea base: copiar conteos de las últimas 4 semanas (OpenTable, mensajes sin contestar) | Dueño | 30 min |

### Sobre el número de WhatsApp
- **Opción recomendada:** WhatsApp Cloud API con *coexistencia*: el mismo número sigue funcionando en la app WhatsApp Business
  del celular y además entra a la bandeja del CRM. Requiere app WhatsApp Business actualizada y verificación del negocio en Meta.
- Si la coexistencia no está disponible para ese número: usar un número nuevo solo para el CRM y publicarlo en Instagram y la web.
- Evitá conectores no oficiales (que "escanean el QR" de WhatsApp Web): Meta puede bloquear el número del restaurante.

## 2.2 Conectar Sofía con el módulo de reservas

Sofía necesita **4 herramientas** (definidas en `sofia/herramientas.json`) y el **bloque de instrucciones** (`sofia/prompt-reservas.md`).

### Si Sofía corre en n8n (nodo *AI Agent*)
1. En el agente, agregar 4 *HTTP Request Tool*, una por herramienta, con la URL y método de `herramientas.json`.
2. Credencial: *Header Auth* → nombre `Authorization`, valor `Bearer TU_API_KEY`.
3. En cada tool, describir los parámetros como en `input_schema` (n8n deja que el modelo los complete con `$fromAI()`).
4. Pegar el bloque de `prompt-reservas.md` en el *System Message* del agente; poner la fecha de hoy con una expresión
   (`{{ $now.setZone('America/Costa_Rica').toFormat('yyyy-MM-dd, cccc') }}`).

### Si Sofía está dentro del CRM (asistente nativo con "acciones" o "herramientas HTTP")
Crear las mismas 4 acciones HTTP con la cabecera `Authorization: Bearer ...`. Si el CRM no permite herramientas HTTP,
poné n8n en el medio: el CRM manda el mensaje a n8n por webhook y n8n corre el agente (opción anterior).

### Si Sofía es código propio con la API de Claude
Las herramientas se pasan tal cual en `tools` (`name`, `description`, `input_schema`); tu código hace la llamada HTTP.

## 2.3 Eventos de vuelta: recordatorios, aprobaciones y reseñas

El módulo genera eventos y los manda por **webhook** (variable `WEBHOOK_URL`) a n8n, firmados con `x-firma` (HMAC-SHA256 con `WEBHOOK_SECRET`).
Si preferís no usar webhook, n8n puede consultar `GET /api/eventos?desde_id=N` cada minuto.

| Evento | Qué hacer en n8n |
|---|---|
| `reserva.confirmada` | Si `creado_por` es `web` o `equipo`, o es un grupo aprobado → plantilla de confirmación |
| `grupo.pendiente_aprobacion` / `evento.solicitud` | Avisar al equipo de Eventos |
| `grupo.aprobacion_vencida` | Recordar al encargado |
| `reserva.rechazada` | Plantilla `grupo_no_disponible` |
| `recordatorio.24h` / `recordatorio.3h` | Plantillas de recordatorio |
| `post_visita.resena` | Plantilla de reseña + actualizar ficha |
| `reserva.no_show` / `reserva.cancelada` | Actualizar ficha |

## 2.4 Reemplazar los botones de OpenTable

- En el sitio web, cambiar el link de "Reservar" a `https://reservas.DOMINIO/reservar` (o abrir el chat de Sofía).
- En Instagram y Google Business Profile: el **link de reservas** pasa a la página propia (guía 3).
- Durante el piloto **no** se apaga OpenTable: las reservas de OpenTable las carga el anfitrión en el panel (*Nueva*, canal "presencial"
  o "telefono") para que no haya doble venta. La decisión de bajar o quitar OpenTable se toma con números (guía 5).

## 2.5 Respaldos

- La base es un solo archivo: `datos/reservas.db`. Respaldo diario:
  ```bash
  sqlite3 datos/reservas.db ".backup 'respaldo-$(date +%F).db'"
  ```
  (si falta: `apt install sqlite3`) y subirlo a un almacenamiento externo (Backblaze B2, Google Drive o S3). Activar también los snapshots del proveedor del VPS.
