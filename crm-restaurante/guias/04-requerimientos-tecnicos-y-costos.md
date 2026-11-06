# 4 · Requerimientos técnicos y costos mensuales

Precios en dólares, de referencia a noviembre de 2026. **Verificá el precio actual del proveedor antes de cotizar**: cambian.

---

## 4.1 Arquitectura

```
 WhatsApp ─┐                                   ┌─ Panel del equipo (tablet / celular)
 Instagram ─┤                                   │
 Messenger ─┼──► CRM omnicanal (bandeja) ──► Sofía (IA) ──► Módulo de reservas ──► SQLite (archivo)
 Chat web  ─┤        │                      │      ▲                │
 Correo    ─┘        │                      │      └── API de IA     ├─► Página pública /reservar
                     │                      │      (Claude u otro)   └─► Eventos ─► n8n ─► Plantillas WhatsApp
                     └── Postgres + Redis   └── n8n (orquestación, si Sofía corre ahí)
```

| Capa | Qué es | Tecnología |
|---|---|---|
| **Backend del CRM** | Bandeja omnicanal, contactos, etiquetas, equipos | El CRM que ya usás (si es autoalojado, típicamente Chatwoot: Ruby on Rails + PostgreSQL + Redis + Sidekiq) |
| **Orquestación / IA** | Sofía: recibe el mensaje, llama al modelo, usa herramientas | n8n (nodo AI Agent) o el asistente nativo del CRM |
| **Backend de reservas** | Disponibilidad, reglas, recordatorios, métricas | Este repo: Node.js 22, sin dependencias, SQLite |
| **Frontend** | Panel del equipo + página pública de reserva | HTML/JS estático servido por el mismo módulo (no necesita build) |
| **Proxy y HTTPS** | Certificados automáticos, subdominios | Caddy (o Nginx + Certbot) |
| **Base de datos** | Reservas y eventos | SQLite (un archivo; aguanta de sobra un restaurante. Si un día manejás 50+ restaurantes en un solo servidor, migrar a PostgreSQL) |
| **Mensajería** | WhatsApp Business Platform (Cloud API oficial de Meta), Instagram y Messenger API | Directo con Meta, sin intermediario |

## 4.2 Servidor (VPS)

| Escenario | Qué corre | Mínimo | Ejemplos (precio aprox./mes) |
|---|---|---|---|
| **Solo módulo de reservas** (el CRM ya existe en otro lado) | reservas + Caddy | 1 vCPU, 1 GB RAM, 20 GB | Hetzner CX22 o similar ~$5 · DigitalOcean 1 GB ~$6 |
| **Stack completo por restaurante** (recomendado, "servidor propio" como dice CT-02) | CRM + Postgres + Redis + n8n + reservas | 4 vCPU, 8 GB RAM, 80 GB SSD | Hetzner CPX31 ~$17–20 · Contabo VPS M ~$10–14 · DigitalOcean 8 GB ~$48 |
| **Tu VPS AxelSites** (demo + tu propio negocio) | Igual que arriba | 4 vCPU, 8 GB | ~$15–20 |

Recomendación: **Hetzner** (Ashburn, EE. UU.) por precio/rendimiento y buena latencia a Costa Rica. Con menos de 4 GB de RAM, el CRM tipo Chatwoot se pone lento.
Sistema operativo: Ubuntu 24.04 LTS. Acceso por SSH con llave, firewall con solo 22/80/443 abiertos.

## 4.3 Costos mensuales por restaurante (piloto típico: 1.500 conversaciones y 400 reservas/mes)

| Concepto | Costo/mes | Notas |
|---|---|---|
| VPS 4 vCPU / 8 GB | $15 – $20 | Hetzner/Contabo. $48 si es DigitalOcean |
| Snapshots / backups del proveedor | $3 – $4 | ~20 % del VPS en Hetzner |
| Respaldo externo (Backblaze B2) | ~$1 | Unos pocos GB |
| Dominio / subdominio | $0 | Se usa un subdominio del dominio del restaurante |
| Certificados HTTPS | $0 | Let's Encrypt automático vía Caddy |
| **IA (Sofía)** con Claude Haiku 5.5 | **~$3 – $8** | $0,10 por millón de tokens de entrada / $0,50 de salida. ≈ $0,003–0,005 por conversación con caché del prompt |
| IA con Claude Sonnet 5.5 (si se necesita más criterio) | ~$60 – $100 | $2 / $10 por millón; ≈ $0,04–0,06 por conversación. Recomendado empezar con Haiku y subir solo si falla |
| WhatsApp: respuestas a clientes (dentro de 24 h) | $0 | Los mensajes de servicio son gratis |
| WhatsApp: plantillas de utilidad (recordatorios, confirmaciones fuera de 24 h) | ~$5 – $15 | Meta cobra por mensaje entregado; utilidad en Latinoamérica ronda $0,01–0,02. 400 reservas × ~1,5 plantillas. **Revisar tarifa de Costa Rica en la página de precios de WhatsApp Business** |
| WhatsApp: plantillas de marketing (campañas) | Aparte | Más caras (~$0,06–0,08). No incluidas en el piloto |
| Instagram / Messenger | $0 | Sin costo por mensaje |
| n8n autoalojado | $0 | Licencia community, en el mismo VPS |
| CRM autoalojado (Chatwoot community u otro open source) | $0 | Si usás un CRM SaaS, sumar su licencia |
| Correo (SMTP para notificaciones) | $0 – $3 | Brevo / Resend en plan gratis alcanza |
| **Total proveedores** | **≈ $27 – $50 / mes** | Con Haiku. Se paga a nombre del restaurante, sin recargo (así lo dice CT-02) |
| Mantenimiento AxelSites (CT-02) | $150 + IVA | Tu ingreso recurrente |

### Cómo se calculó la IA
Una conversación típica de reserva ≈ 8 llamadas al modelo. Cada llamada ≈ 8.000 tokens de instrucciones y carta (en caché),
1.000 tokens nuevos y 300 de respuesta.
- Haiku 5.5: 8 × (8.000 × $0,01/M + 1.000 × $0,10/M + 300 × $0,50/M) ≈ $0,003
- Sonnet 5.5: 8 × (8.000 × $0,20/M + 1.000 × $2/M + 300 × $10/M) ≈ $0,05

Sin caché de prompt el costo de entrada sube hasta 10 veces: **activar prompt caching** en la llamada al modelo (en n8n o en el CRM).
Si Sofía usa otro proveedor de IA, el orden de magnitud con un modelo "mini/rápido" es parecido.

## 4.4 Costos únicos (una vez)

| Concepto | Costo |
|---|---|
| Verificación del negocio en Meta | $0 (requiere documentos del restaurante: cédula jurídica, recibo de servicio o similar) |
| Número de WhatsApp nuevo (solo si no se usa coexistencia) | Chip prepago ~$2 |
| Tablet para el anfitrión (si no tienen) | $100 – $200 |
| Tu instalación (CT-02) | $1.000 + IVA |

## 4.5 Qué necesitás vos (AxelSites) para operar varios restaurantes

- Plantilla de servidor (script o snapshot) para clonar el stack en 1 hora.
- Un repositorio por cliente con su `config.json` y el bloque de Sofía.
- Monitoreo: UptimeRobot gratis contra `https://reservas.CLIENTE/salud` y contra el CRM.
- Un número de WhatsApp de soporte y un horario de soporte escrito en el contrato.
- Revisión semanal de 20 conversaciones al azar por cliente (es lo que vende el mantenimiento mensual).

## 4.6 Lo que este módulo NO hace (todavía) y cuándo hacerlo

| Falta | Cuándo vale la pena |
|---|---|
| Plano visual de mesas con arrastrar y soltar | Si el anfitrión lo pide después del piloto; hoy las mesas se asignan solas |
| Depósitos / pagos con tarjeta para eventos | Con eventos grandes recurrentes: integrar link de pago (Tilopay, ONVO, Stripe) |
| Lista de espera automática | Si en el reporte aparecen muchas `sin-disponibilidad` en viernes y sábado |
| Sincronización con OpenTable | No existe API pública para restaurantes chicos; durante el piloto se cargan a mano |
| Turnos que pasan la medianoche | Solo si el restaurante abre después de las 12 a.m. |
