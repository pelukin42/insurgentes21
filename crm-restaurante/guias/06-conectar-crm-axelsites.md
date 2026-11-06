# 6 · Conectar las reservas a tu CRM (CRM AxelSites)

## Qué CRM es el tuyo

`crm.axelsites.com` **no es Chatwoot ni HighLevel**: es una aplicación propia llamada *CRM Omnicanal*
(panel React + API en `/api/v1`), configurada con el nombre "CRM AxelSites". Por lo que muestra el panel:

- **Una instalación por negocio**: al arrancar por primera vez pide crear *el* administrador (`/primer-arranque`)
  y no tiene selector de cuentas ni "super admin" multi-empresa. **No acepta varias cuentas** dentro de la misma instalación.
- Canales: WhatsApp (Meta Cloud API directo, YCloud o Kapso), Instagram, chat web, correo y llamadas (Retell).
- Sofía es el agente interno; tiene **Herramientas** que llama por webhook con la cabecera `X-Omnicanal-Token`,
  un secreto por herramienta y un botón **Probar**.
- También trae agenda de citas, plantillas de WhatsApp, seguimientos, respaldos y base de conocimiento.

La agenda de citas que trae está pensada para servicios (por ejemplo, de una clínica): no maneja mesas, uniones de mesas ni grupos.
Por eso las reservas van en el módulo propio, conectado como herramientas de Sofía.

## Cómo queda la "opción A" (piloto barato)

Como no hay varias cuentas, la opción A es **una segunda instalación del mismo CRM en tu mismo servidor**:

```
Tu VPS
├── crm.axelsites.com            ← tu CRM (AxelSites), sin tocar
├── crm-insurgentes.axelsites.com ← copia del mismo CRM para el restaurante (su base de datos aparte)
└── reservas-insurgentes.axelsites.com ← módulo de reservas
```

- Mismo costo de servidor (si el VPS tiene ≥ 4 GB de RAM libres para la segunda copia); el restaurante solo paga IA y WhatsApp.
- Datos separados: el equipo del restaurante nunca ve tus conversaciones.
- Al cerrar el negocio se muda a un servidor del restaurante (opción B) con un respaldo/restauración (tu CRM ya trae `Respaldos`).

**No recomendado:** meter el WhatsApp del restaurante en tu CRM actual con otro agente. El equipo del restaurante vería tus clientes
y los reportes quedarían mezclados.

### Lo que necesitás para instalar la segunda copia
El CRM y este módulo corren en contenedores, así que hace falta acceso al servidor por alguna de estas vías:
- **SSH** (activarlo en el panel del proveedor del VPS: Hostinger, DigitalOcean, Hetzner, etc.), o
- el **panel con el que lo instalaste** (Coolify, EasyPanel, Dokploy, Portainer, o el "Docker Manager" del proveedor).
  En ese caso se crea una app nueva desde el mismo repositorio o imagen, con otra base de datos y otro dominio.

## Paso a paso: las 4 herramientas de Sofía

Antes: el módulo de reservas tiene que estar en línea (guía 2) y responder en `https://reservas-…/salud`.

En el CRM del restaurante: **Admin → Herramientas (flujos de n8n) → Nueva herramienta**. La URL no tiene que ser de n8n:
apunta directo al módulo de reservas.

### 1. `consultar_disponibilidad` · Solo consulta
- **Para qué sirve:** `Devuelve los horarios con mesa libre para una fecha y cantidad de personas. Úsala SIEMPRE antes de ofrecer o confirmar un horario.`
- **Datos que pide:**
  | Clave | Tipo | Obligatorio | Qué es |
  |---|---|---|---|
  | `fecha` | Texto | Sí | Fecha en formato AAAA-MM-DD (convertí "mañana", "el sábado") |
  | `personas` | Número | Sí | Cuántas personas en total |
- **URL del webhook:** `https://reservas-insurgentes.axelsites.com/crm/consultar_disponibilidad`

### 2. `crear_reserva` · Hace algo
- **Para qué sirve:** `Crea la reserva cuando el cliente ya confirmó fecha, hora, personas y nombre. Devuelve el código y el mensaje para el cliente. Si no hay mesa devuelve alternativas: ofrécelas.`
- **Datos que pide:**
  | Clave | Tipo | Obligatorio | Qué es |
  |---|---|---|---|
  | `nombre` | Texto | Sí | Nombre y apellido |
  | `telefono` | Texto | Sí | WhatsApp con código de país; en WhatsApp es el número del contacto |
  | `personas` | Número | Sí | Cantidad de personas |
  | `fecha` | Texto | Sí | AAAA-MM-DD |
  | `hora` | Texto | Sí | HH:MM en 24 h, de las que dio consultar_disponibilidad |
  | `ocasion` | Texto | No | Cumpleaños, aniversario, negocios |
  | `notas` | Texto | No | Alergias, silla de bebé, terraza, presupuesto del evento |
  | `idioma` | Opciones: `es, en` | No | Idioma de la conversación |
- **URL:** `https://reservas-insurgentes.axelsites.com/crm/crear_reserva`

### 3. `buscar_reservas` · Solo consulta
- **Para qué sirve:** `Lista las reservas futuras de un teléfono. Úsala cuando el cliente quiere cambiar, confirmar o cancelar.`
- **Datos:** `telefono` (Texto, Sí)
- **URL:** `…/crm/buscar_reservas`

### 4. `cancelar_reserva` · Hace algo
- **Para qué sirve:** `Cancela una reserva por su código, después de confirmarlo con el cliente. Para cambiar una reserva: consultar disponibilidad, cancelar la anterior y crear la nueva.`
- **Datos:** `codigo` (Texto, Sí, código de 6 caracteres) · `telefono` (Texto, Sí) · `motivo` (Texto, No)
- **URL:** `…/crm/cancelar_reserva`

### Secretos y prueba
1. Al guardar cada herramienta, el CRM muestra su **secreto** (cabecera `X-Omnicanal-Token`).
2. Copiá los 4 secretos en el `.env` del módulo de reservas, separados por coma:
   `CRM_TOKENS=secreto1,secreto2,secreto3,secreto4` y reiniciá (`docker compose up -d`).
3. En el CRM, botón **Probar** en cada herramienta. La prueba de `crear_reserva` y `cancelar_reserva` **no** crea ni cancela nada:
   responde "Prueba correcta".
4. Pegá el bloque de `sofia/prompt-reservas.md` en las instrucciones de Sofía (Admin → Agente → Instrucciones / Prompt).
5. Hacé 10 conversaciones de prueba desde tu WhatsApp personal y mirá cada reserva en el panel del módulo.

### Qué recibe y devuelve el módulo
- Acepta los datos de la herramienta en `args`, `parametros`, `arguments` o en el cuerpo plano; si el CRM manda el contacto
  (`contacto.telefono`), lo usa cuando falta `telefono`.
- Siempre responde `200` con `{ "ok": true|false, "mensaje": "…" }` para que Sofía lea el resultado y siga la conversación
  (por ejemplo, ofrecer las alternativas cuando no hay mesa).

> Si al probar el CRM muestra un error de formato, mandame lo que dice el registro de la herramienta
> (Admin → Sistema → Registros) y ajusto el adaptador; el formato exacto del cuerpo que manda tu CRM no es público.
