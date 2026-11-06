# 7 · Instalar el piloto con Coolify (sin SSH)

Todo se hace desde el panel web de Coolify. Al final vas a tener, en el mismo servidor:

```
crm.axelsites.com                   ← tu CRM, NO se toca
crm-insurgentes.axelsites.com       ← copia del CRM para el restaurante (base de datos propia)
reservas-insurgentes.axelsites.com  ← módulo de reservas
```

Tiempo: 1 a 2 horas. Orden: **0 → 1 → 2 → 3 → 4**. No te saltes el paso 0.

---

## Paso 0 · Antes de tocar nada (10 min)

1. **Respaldo de tu CRM**: en tu CRM → Admin → Respaldos → *Ejecutar ahora*. Verificá que terminó bien.
2. **Memoria del servidor**: Coolify → *Servers* → tu servidor → *Metrics* (o el panel de tu proveedor del VPS).
   La segunda copia del CRM suma más o menos lo mismo que consume la primera. Si la memoria usada pasa del 60 %,
   primero subí el plan del VPS (a 8 GB).
3. **DNS** (donde administrás el dominio `axelsites.com`): creá dos registros **A** que apunten a **la misma IP** que `crm.axelsites.com`:
   - `crm-insurgentes` → IP del servidor
   - `reservas-insurgentes` → IP del servidor

   Esperá unos minutos y comprobá que resuelven antes de seguir (si no, el certificado HTTPS falla).

## Paso 1 · Proyecto nuevo

Coolify → *Projects* → **+ Add** → nombre `Insurgentes 21`. Todo lo del restaurante va en este proyecto, separado de AxelSites.

## Paso 2 · Copia del CRM para el restaurante

### Opción recomendada: clonar el recurso
1. Abrí tu CRM en Coolify (el proyecto donde está `crm.axelsites.com`).
2. Pestaña **Resource Operations** (en algunas versiones está dentro de *Advanced*) → **Clone** → destino: proyecto `Insurgentes 21`, mismo servidor.
3. **No le des Deploy todavía.** Abrí el recurso clonado y cambiá:

| Dónde | Qué cambiar | Por qué |
|---|---|---|
| *Domains* (de cada servicio que tenga dominio) | `https://crm-insurgentes.axelsites.com` | Si queda el mismo dominio, choca con tu CRM |
| *Environment Variables* → nombre de la app (`APP_NAME`, `VITE_APP_NAME` o parecido) | `CRM Insurgentes 21` | Es el nombre que se ve en el panel |
| *Environment Variables* → **toda** variable con `SECRET`, `KEY`, `TOKEN`, `PASSWORD` o `ENCRYPTION` en el nombre (salvo las que sean de un proveedor externo que vayas a compartir a propósito) | Un valor nuevo. Coolify tiene el botón para generar uno; o usá un generador de contraseñas de 48 caracteres | Que el restaurante no pueda leer ni firmar nada de tu CRM |
| *Environment Variables* → URLs que digan `crm.axelsites.com` | Cambiarlas a `crm-insurgentes.axelsites.com` | Webhooks y enlaces |
| *Persistent Storage* | Los **volúmenes deben tener nombre distinto** a los de tu CRM (Coolify suele agregarles un código nuevo al clonar; revisalo uno por uno) | Si apuntan al mismo volumen, las dos instalaciones comparten base de datos: **se mezclan o se dañan los datos** |

4. **Guardá la nueva llave de cifrado** (la variable con `ENCRYPTION` o `FERNET` en el nombre) en tu gestor de contraseñas,
   con el nombre "CRM Insurgentes 21". Sin ella un respaldo no se puede restaurar.
5. **Deploy**. Cuando termine, abrí `https://crm-insurgentes.axelsites.com`: te tiene que mandar a **Primer arranque**
   para crear el administrador. Si en cambio te pide login con tu usuario de AxelSites, **pará**: está usando tu base de datos;
   revisá *Persistent Storage* y las variables de conexión a la base.

### Si no aparece "Clone"
Creá un recurso nuevo en el proyecto `Insurgentes 21` **igual al de tu CRM**: misma fuente (repositorio o imagen), mismo
*Build Pack* (normalmente *Docker Compose*), y copiá las variables de entorno de tu CRM aplicando los cambios de la tabla.

### Dentro del CRM nuevo
- Primer arranque → creá tu usuario administrador (después agregás al equipo del restaurante en *Usuarios*).
- Admin → **Apariencia**: logo y colores de Insurgentes 21.
- Admin → **Canales**: conectá WhatsApp del restaurante, Instagram y el chat web (guía 3 para los accesos de Meta).
- Admin → **Proveedores de IA**: idealmente una **API key aparte** para el restaurante, así medís su costo de IA separado del tuyo.
- Admin → **Respaldos**: configurá el destino externo y la hora diaria, igual que en tu CRM.

## Paso 3 · Módulo de reservas

1. Proyecto `Insurgentes 21` → **+ New** → **Application** → fuente:
   - *Public Repository* si el repositorio `pelukin42/insurgentes21` es público, o
   - *Private Repository (with GitHub App)* si es privado (podés usar la misma GitHub App de Coolify que ya tengas).
2. Configuración:

| Campo | Valor |
|---|---|
| Repository | `https://github.com/pelukin42/insurgentes21` |
| Branch | `claude/determined-goodall-gnn6qk` (o `main` cuando lo unas) |
| Build Pack | **Dockerfile** |
| Base Directory | `/crm-restaurante/reservas` |
| Ports Exposes | `3100` |
| Domains | `https://reservas-insurgentes.axelsites.com` |

   Coolify ya pone HTTPS: **no** uses el `docker-compose.yml` ni el `Caddyfile` del módulo (son para servidores sin Coolify).

3. *Environment Variables*:

| Variable | Valor |
|---|---|
| `API_KEY` | 48 caracteres al azar (es la llave del panel del equipo y de la API) |
| `CRM_TOKENS` | Vacío por ahora; en el paso 4 pegás los secretos de las herramientas |
| `WEBHOOK_URL` | Vacío por ahora (recordatorios automáticos: ver paso 5) |

4. *Persistent Storage* → **+ Add**:
   - **Volume Mount**: nombre `reservas-insurgentes-datos`, ruta de destino `/data`. Ahí vive la base de reservas.
   - **File Mount**: ruta de destino `/app/config.json`, contenido = el `config.json` con **las mesas y horarios reales** del restaurante.
     Así lo editás desde Coolify (después de cambiarlo: *Restart*) sin tocar el repositorio.
5. *Healthcheck*: ruta `/salud`, puerto `3100`.
6. **Deploy**. Probá:
   - `https://reservas-insurgentes.axelsites.com/salud` → `{"ok":true,"restaurante":"Insurgentes 21"}`
   - `https://reservas-insurgentes.axelsites.com/panel` → entrar con la `API_KEY`
   - `https://reservas-insurgentes.axelsites.com/reservar` → hacer una reserva de prueba y cancelarla en el panel
7. *Scheduled Tasks* → **+ Add**:
   - Nombre `respaldo-reservas` · Comando `node --disable-warning=ExperimentalWarning scripts/respaldo.js` · Frecuencia `0 3 * * *` (3 a.m. todos los días).
   - Guarda una copia diaria en `/data/respaldos/` (últimos 14 días). Una vez por semana descargala desde Coolify
     (o subila con el destino de respaldos) para tener una copia **fuera** del servidor.

## Paso 4 · Conectar Sofía (en el CRM nuevo)

Seguí la **guía 6** (`06-conectar-crm-axelsites.md`): las 4 herramientas con URL
`https://reservas-insurgentes.axelsites.com/crm/<nombre>`. Después:

1. Copiá los 4 secretos de las herramientas → Coolify → módulo de reservas → *Environment Variables* →
   `CRM_TOKENS=secreto1,secreto2,secreto3,secreto4` → **Restart**.
2. En el CRM, botón **Probar** en cada herramienta (no crea ni cancela nada).
3. Pegá el bloque de `sofia/prompt-reservas.md` en las instrucciones de Sofía.
4. 10 conversaciones de prueba desde tu WhatsApp; cada reserva tiene que aparecer en el panel.

## Paso 5 · Recordatorios por WhatsApp (semana 2 del piloto)

El módulo genera los avisos (`recordatorio.24h`, `recordatorio.3h`, `post_visita.resena`…). Para que salgan por WhatsApp hay que
mandarlos a algo que envíe plantillas:
- Si tu CRM tiene un webhook de entrada para "envíos salientes" (*Admin → Envíos / Outbound*), poné esa URL en `WEBHOOK_URL`.
- Si no, un flujo de n8n recibe el evento y envía la plantilla aprobada (`sofia/plantillas-whatsapp.md`).

Mientras tanto, el piloto funciona igual: Sofía reserva, el equipo ve todo en el panel y la pestaña **Resultados** mide el ROI.

## Si algo falla

| Síntoma | Causa probable |
|---|---|
| El dominio no abre o da error de certificado | El registro DNS todavía no apunta al servidor; esperá y redeploy |
| El CRM nuevo muestra tus conversaciones de AxelSites | Comparte volumen o base de datos con el tuyo → apagalo ya y revisá *Persistent Storage* y la variable de conexión a la base |
| `/salud` no responde | En *Logs* del módulo: si dice "Definí API_KEY", falta la variable o tiene menos de 24 caracteres |
| La herramienta en el CRM responde "Token de herramienta incorrecto" | Falta su secreto en `CRM_TOKENS` o no reiniciaste el módulo |
| Las reservas desaparecen al redeploy | Falta el *Volume Mount* en `/data` |
