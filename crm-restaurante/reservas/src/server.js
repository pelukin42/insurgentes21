// Servidor HTTP del módulo de reservas. Sin dependencias: solo Node 22+.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { abrirDB } from "./db.js";
import { crearMotor, ErrorReserva } from "./motor.js";
import { crearNotificador } from "./notificador.js";

const AQUI = dirname(fileURLToPath(import.meta.url));
const PUBLICO = join(AQUI, "..", "public");

export function crearApp({ config, db, apiKey, reloj }) {
  const motor = crearMotor({ db, config, reloj });
  const estaticos = {
    "/panel": ["panel.html", "text/html; charset=utf-8"],
    "/reservar": ["reservar.html", "text/html; charset=utf-8"],
  };
  const limites = new Map(); // ip -> [timestamps]

  function limitar(ip, max = 20, ventanaMs = 60000) {
    const ahora = Date.now();
    const lista = (limites.get(ip) || []).filter((t) => ahora - t < ventanaMs);
    lista.push(ahora);
    limites.set(ip, lista);
    if (limites.size > 5000) limites.clear();
    return lista.length <= max;
  }

  function autorizado(req) {
    const h = req.headers.authorization || "";
    const dado = Buffer.from(h.startsWith("Bearer ") ? h.slice(7) : "");
    const esperado = Buffer.from(apiKey || "");
    return esperado.length > 0 && dado.length === esperado.length && timingSafeEqual(dado, esperado);
  }

  async function leerJSON(req) {
    let cuerpo = "";
    for await (const parte of req) {
      cuerpo += parte;
      if (cuerpo.length > 50000) throw new ErrorReserva("CUERPO_GRANDE", "Solicitud demasiado grande.", {}, 413);
    }
    if (!cuerpo) return {};
    try { return JSON.parse(cuerpo); } catch { throw new ErrorReserva("JSON_INVALIDO", "El cuerpo no es JSON válido.", {}, 400); }
  }

  function enviar(res, status, datos, cors = false) {
    const h = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
    if (cors) Object.assign(h, { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type" });
    res.writeHead(status, h);
    res.end(JSON.stringify(datos));
  }

  async function manejar(req, res) {
    const url = new URL(req.url, "http://x");
    const ruta = url.pathname.replace(/\/+$/, "") || "/";
    const q = Object.fromEntries(url.searchParams);
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
    const esPublico = ruta.startsWith("/public/");

    try {
      if (req.method === "OPTIONS" && esPublico) {
        res.writeHead(204, { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST", "access-control-allow-headers": "content-type" });
        return res.end();
      }
      if (ruta === "/") { res.writeHead(302, { location: "/panel" }); return res.end(); }
      if (ruta === "/salud") return enviar(res, 200, { ok: true, restaurante: config.restaurante });
      if (estaticos[ruta] && req.method === "GET") {
        const [archivo, tipo] = estaticos[ruta];
        res.writeHead(200, { "content-type": tipo });
        return res.end(readFileSync(join(PUBLICO, archivo)));
      }

      // ---------- Público: página de reserva propia (reemplazo del widget de OpenTable) ----------
      if (esPublico) {
        if (ruta === "/public/info" && req.method === "GET")
          return enviar(res, 200, {
            restaurante: config.restaurante,
            autoConfirmarHasta: config.reglas.autoConfirmarHasta,
            grupoHasta: config.reglas.grupoHasta,
            diasMaximosAdelante: config.reglas.diasMaximosAdelante,
          }, true);
        if (ruta === "/public/disponibilidad" && req.method === "GET")
          return enviar(res, 200, motor.disponibilidad(q.fecha, q.personas), true);
        if (ruta === "/public/reservas" && req.method === "POST") {
          if (!limitar(ip, 10)) return enviar(res, 429, { error: "DEMASIADAS_SOLICITUDES", mensaje: "Intentá de nuevo en un minuto." }, true);
          const d = await leerJSON(req);
          if (d.sitio_web) return enviar(res, 400, { error: "SPAM" }, true); // campo trampa del formulario
          const r = motor.crear({ ...d, canal: "web", creado_por: "web", conversacion_id: null });
          return enviar(res, 201, { reserva: { codigo: r.codigo, estado: r.estado, tipo: r.tipo } }, true);
        }
        const m = /^\/public\/reservas\/([A-Za-z0-9]+)\/cancelar$/.exec(ruta);
        if (m && req.method === "POST") {
          if (!limitar(ip, 10)) return enviar(res, 429, { error: "DEMASIADAS_SOLICITUDES" }, true);
          const d = await leerJSON(req);
          const r = motor.cancelarPorCliente(m[1], d.telefono);
          return enviar(res, 200, { reserva: { codigo: r.codigo, estado: r.estado } }, true);
        }
        return enviar(res, 404, { error: "NO_EXISTE" }, true);
      }

      // ---------- Privado: Sofía (CRM / n8n) y panel del equipo ----------
      if (!ruta.startsWith("/api/")) return enviar(res, 404, { error: "NO_EXISTE" });
      if (!autorizado(req)) return enviar(res, 401, { error: "NO_AUTORIZADO", mensaje: "Falta o es incorrecta la API key." });

      if (ruta === "/api/disponibilidad" && req.method === "GET")
        return enviar(res, 200, motor.disponibilidad(q.fecha, q.personas));
      if (ruta === "/api/reservas" && req.method === "POST") {
        const d = await leerJSON(req);
        const r = motor.crear({ creado_por: "sofia", ...d });
        return enviar(res, 201, { reserva: r, mensaje_sugerido: mensajeSugerido(r, config) });
      }
      if (ruta === "/api/reservas" && req.method === "GET") {
        if (q.telefono) return enviar(res, 200, { reservas: motor.buscarPorTelefono(q.telefono) });
        if (q.fecha) return enviar(res, 200, { reservas: motor.delDia(q.fecha) });
        return enviar(res, 400, { error: "FALTA_FILTRO", mensaje: "Usá ?fecha=AAAA-MM-DD o ?telefono=..." });
      }
      if (ruta === "/api/reservas/pendientes" && req.method === "GET")
        return enviar(res, 200, { reservas: motor.pendientes() });
      let m = /^\/api\/reservas\/([A-Za-z0-9]+)$/.exec(ruta);
      if (m && req.method === "GET") {
        const r = motor.porCodigo(m[1]);
        return r ? enviar(res, 200, { reserva: r }) : enviar(res, 404, { error: "NO_ENCONTRADA" });
      }
      m = /^\/api\/reservas\/([A-Za-z0-9]+)\/(aprobar|rechazar|cancelar|sentar|completar|no_show)$/.exec(ruta);
      if (m && req.method === "POST") {
        const d = await leerJSON(req);
        const r = motor.cambiarEstado(m[1], m[2], d);
        return enviar(res, 200, { reserva: r });
      }
      if (ruta === "/api/metricas" && req.method === "GET")
        return enviar(res, 200, motor.metricas(q.desde, q.hasta));
      if (ruta === "/api/eventos" && req.method === "GET") {
        const desde = Number(q.desde_id || 0);
        const filas = db.prepare("SELECT * FROM eventos WHERE id > ? ORDER BY id LIMIT 100").all(desde);
        return enviar(res, 200, {
          eventos: filas.map((e) => ({ id: e.id, evento: e.tipo, creado_en: new Date(e.creado_en).toISOString(), ...JSON.parse(e.datos) })),
        });
      }
      return enviar(res, 404, { error: "NO_EXISTE" });
    } catch (err) {
      if (err instanceof ErrorReserva)
        return enviar(res, err.http, { error: err.codigo, mensaje: err.message, ...err.extra }, esPublico);
      console.error(err);
      return enviar(res, 500, { error: "ERROR_INTERNO" }, esPublico);
    }
  }

  return { manejar, motor };
}

/** Texto listo para que Sofía lo mande (ella lo puede adaptar al tono de la conversación). */
export function mensajeSugerido(r, config) {
  const fecha = new Date(`${r.fecha}T12:00:00Z`).toLocaleDateString(r.idioma === "en" ? "en-US" : "es-CR", {
    weekday: "long", day: "numeric", month: "long", timeZone: "UTC",
  });
  const tol = config.reglas.minutosToleranciaLlegada;
  if (r.idioma === "en") {
    if (r.estado === "confirmada")
      return `You're all set, ${r.nombre}! Table for ${r.personas} on ${fecha} at ${r.hora}. Confirmation code: ${r.codigo}. We'll hold the table for ${tol} minutes. See you at ${config.restaurante}!`;
    if (r.estado === "pendiente")
      return `Thank you, ${r.nombre}! I've put a hold on a table for ${r.personas} on ${fecha} at ${r.hora} (code ${r.codigo}). For groups our team confirms personally — you'll hear from us by tomorrow morning.`;
    return `Thank you, ${r.nombre}! Your private event request for ${r.personas} guests on ${fecha} is registered (code ${r.codigo}). Our events team will contact you to plan the details.`;
  }
  if (r.estado === "confirmada")
    return `¡Listo, ${r.nombre}! Mesa para ${r.personas} el ${fecha} a las ${r.hora}. Código de reserva: ${r.codigo}. Le guardamos la mesa ${tol} minutos. ¡Lo esperamos en ${config.restaurante}!`;
  if (r.estado === "pendiente")
    return `¡Gracias, ${r.nombre}! Le aparté mesa para ${r.personas} el ${fecha} a las ${r.hora} (código ${r.codigo}). Para grupos el equipo confirma personalmente; le escribimos a más tardar mañana en la mañana.`;
  return `¡Gracias, ${r.nombre}! Su solicitud de evento privado para ${r.personas} personas el ${fecha} quedó registrada (código ${r.codigo}). El equipo de eventos lo contacta para coordinar los detalles.`;
}

// ---------- Arranque ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rutaConfig = process.env.CONFIG || join(AQUI, "..", "config.json");
  const config = JSON.parse(readFileSync(rutaConfig, "utf8"));
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.length < 24) {
    console.error("Definí API_KEY (mínimo 24 caracteres). Ej: API_KEY=$(openssl rand -hex 24)");
    process.exit(1);
  }
  const db = abrirDB(process.env.DB_PATH || join(AQUI, "..", "datos", "reservas.db"));
  const { manejar, motor } = crearApp({ config, db, apiKey });
  const notif = crearNotificador({ db, url: process.env.WEBHOOK_URL, secreto: process.env.WEBHOOK_SECRET });
  const ciclo = async () => { try { motor.tic(); await notif.enviarPendientes(); } catch (e) { console.error(e); } };
  setInterval(ciclo, 60000);
  ciclo();
  const puerto = Number(process.env.PORT || 3100);
  createServer(manejar).listen(puerto, () =>
    console.log(`Reservas ${config.restaurante} en http://localhost:${puerto}  (panel: /panel · reserva pública: /reservar)`),
  );
}
