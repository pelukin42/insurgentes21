// Envía la bandeja de eventos al CRM / n8n por webhook (POST JSON, firmado con HMAC si hay secreto).
import { createHmac } from "node:crypto";

export function crearNotificador({ db, url, secreto, log = console }) {
  let ocupado = false;

  async function enviarPendientes() {
    if (!url || ocupado) return 0;
    ocupado = true;
    let enviados = 0;
    try {
      const pend = db.prepare("SELECT * FROM eventos WHERE enviado = 0 AND intentos < 10 ORDER BY id LIMIT 50").all();
      for (const e of pend) {
        const cuerpo = JSON.stringify({ id: e.id, evento: e.tipo, creado_en: new Date(e.creado_en).toISOString(), ...JSON.parse(e.datos) });
        const headers = { "content-type": "application/json" };
        if (secreto) headers["x-firma"] = createHmac("sha256", secreto).update(cuerpo).digest("hex");
        try {
          const res = await fetch(url, { method: "POST", headers, body: cuerpo, signal: AbortSignal.timeout(10000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          db.prepare("UPDATE eventos SET enviado = 1 WHERE id = ?").run(e.id);
          enviados++;
        } catch (err) {
          db.prepare("UPDATE eventos SET intentos = intentos + 1 WHERE id = ?").run(e.id);
          log.warn(`[webhook] evento ${e.id} (${e.tipo}) falló: ${err.message}`);
          break; // mantener el orden; se reintenta en el próximo ciclo
        }
      }
    } finally {
      ocupado = false;
    }
    return enviados;
  }

  return { enviarPendientes };
}
