// Motor de reservas: disponibilidad, asignación de mesas y reglas por tipo (individual, grupo, evento).
import { randomInt } from "node:crypto";
import { ahoraLocal, aMin, aHora, fechaValida, diaSemana, sumarDias, diasEntre, instante } from "./tiempo.js";

export const ESTADOS_ACTIVOS = ["confirmada", "pendiente", "sentada"];
export const CANALES = ["whatsapp", "instagram", "messenger", "web", "telefono", "correo", "presencial"];
export const CREADORES = ["sofia", "web", "equipo"];

export class ErrorReserva extends Error {
  constructor(codigo, mensaje, extra = {}, http = 422) {
    super(mensaje);
    this.codigo = codigo;
    this.extra = extra;
    this.http = http;
  }
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nuevoCodigo = () => Array.from({ length: 6 }, () => ALFABETO[randomInt(ALFABETO.length)]).join("");

export function crearMotor({ db, config, reloj = () => Date.now() }) {
  const zona = config.zonaHoraria;
  const R = config.reglas;

  const duracion = (personas) =>
    (config.duracionMesaMin.find((d) => personas <= d.hastaPersonas) || config.duracionMesaMin.at(-1)).minutos;

  const tipoPara = (personas) =>
    personas <= R.autoConfirmarHasta ? "individual" : personas <= R.grupoHasta ? "grupo" : "evento";

  /** Turnos del día [[inicioMin, finMin], ...] o [] si está cerrado. */
  function turnos(fecha) {
    if ((config.fechasBloqueadas || []).includes(fecha)) return [];
    return (config.horario[String(diaSemana(fecha))] || []).map(([a, b]) => [aMin(a), aMin(b)]);
  }

  function ocupadas(fecha, inicio, fin, excluirId) {
    const filas = db
      .prepare(
        `SELECT id, mesas FROM reservas
         WHERE fecha = ? AND estado IN ('confirmada','pendiente','sentada')
           AND inicio_min < ? AND fin_min > ?`,
      )
      .all(fecha, fin, inicio);
    const set = new Set();
    for (const f of filas) if (f.id !== excluirId) for (const m of JSON.parse(f.mesas)) set.add(m);
    return set;
  }

  /** Mesas para un grupo de `personas` en ese horario, o null. Prefiere la opción más chica que alcance. */
  function asignar(fecha, inicio, personas, { permitirVip = false, excluirId } = {}) {
    const fin = inicio + duracion(personas);
    const ocup = ocupadas(fecha, inicio, fin, excluirId);
    const sueltas = config.mesas
      .filter((m) => (permitirVip || !m.soloConAprobacion) && m.min <= personas && personas <= m.max && !ocup.has(m.id))
      .sort((a, b) => a.max - b.max);
    if (sueltas.length) return [sueltas[0].id];
    const combos = (config.combinaciones || [])
      .filter((c) => c.min <= personas && personas <= c.max && c.mesas.every((id) => !ocup.has(id)))
      .sort((a, b) => a.max - b.max || a.mesas.length - b.mesas.length);
    return combos.length ? [...combos[0].mesas] : null;
  }

  /** Valida fecha (sin hora). Lanza ErrorReserva si no se puede reservar ese día. */
  function validarFecha(fecha) {
    if (!fechaValida(fecha)) throw new ErrorReserva("FECHA_INVALIDA", "La fecha debe tener formato AAAA-MM-DD.");
    const hoy = ahoraLocal(zona, reloj());
    const d = diasEntre(hoy.fecha, fecha);
    if (d < 0) throw new ErrorReserva("FECHA_PASADA", "Esa fecha ya pasó.");
    if (d > R.diasMaximosAdelante)
      throw new ErrorReserva("FECHA_LEJANA", `Se puede reservar hasta ${R.diasMaximosAdelante} días antes.`);
    if (!turnos(fecha).length) throw new ErrorReserva("CERRADO", "El restaurante no abre ese día.");
  }

  /** Horarios en que se puede iniciar una reserva ese día, sin mirar mesas. */
  function horariosDelDia(fecha) {
    const hoy = ahoraLocal(zona, reloj());
    const minimo = fecha === hoy.fecha ? hoy.min + R.anticipacionMinimaMin : -1;
    const paso = config.intervaloMinutos;
    const out = [];
    for (const [a, b] of turnos(fecha)) {
      const ultimo = b - config.ultimaReservaAntesDelCierreMin;
      for (let t = Math.ceil(a / paso) * paso; t <= ultimo; t += paso) if (t >= minimo) out.push(t);
    }
    return out;
  }

  function disponibilidad(fecha, personas) {
    personas = validarPersonas(personas);
    validarFecha(fecha);
    const tipo = tipoPara(personas);
    if (tipo === "evento")
      return { fecha, personas, tipo, horarios: [], nota: "Grupo grande: se atiende como evento privado con el equipo." };
    const permitirVip = tipo === "grupo";
    const horarios = horariosDelDia(fecha)
      .filter((t) => asignar(fecha, t, personas, { permitirVip }))
      .map(aHora);
    return { fecha, personas, tipo, horarios };
  }

  /** Hasta `n` alternativas cercanas: mismo día (más cerca de la hora pedida) y días siguientes. */
  function alternativas(fecha, inicio, personas, n = 4) {
    const permitirVip = tipoPara(personas) === "grupo";
    const res = [];
    const mismoDia = horariosDelDia(fecha)
      .filter((t) => t !== inicio && asignar(fecha, t, personas, { permitirVip }))
      .sort((a, b) => Math.abs(a - inicio) - Math.abs(b - inicio))
      .slice(0, 3);
    for (const t of mismoDia) res.push({ fecha, hora: aHora(t) });
    for (let i = 1; i <= 7 && res.length < n; i++) {
      const f = sumarDias(fecha, i);
      try { validarFecha(f); } catch { continue; }
      const t = horariosDelDia(f).find((x) => x === inicio && asignar(f, x, personas, { permitirVip }))
        ?? horariosDelDia(f).filter((x) => asignar(f, x, personas, { permitirVip }))
          .sort((a, b) => Math.abs(a - inicio) - Math.abs(b - inicio))[0];
      if (t !== undefined) res.push({ fecha: f, hora: aHora(t) });
    }
    return res.slice(0, n);
  }

  function validarPersonas(p) {
    const n = Number(p);
    if (!Number.isInteger(n) || n < 1 || n > 500) throw new ErrorReserva("PERSONAS_INVALIDO", "Número de personas inválido.");
    return n;
  }

  function fueraDeHorario(ms) {
    const { min } = ahoraLocal(zona, ms);
    const a = aMin(config.atencionHumana.desde), b = aMin(config.atencionHumana.hasta);
    return min < a || min >= b;
  }

  const fila = (id) => db.prepare("SELECT * FROM reservas WHERE id = ?").get(id);
  const porCodigo = (codigo) =>
    db.prepare("SELECT * FROM reservas WHERE codigo = ?").get(String(codigo || "").trim().toUpperCase());

  function emitir(tipo, reserva, extra = {}) {
    db.prepare("INSERT INTO eventos (tipo, reserva_id, datos, creado_en) VALUES (?, ?, ?, ?)").run(
      tipo, reserva?.id ?? null, JSON.stringify({ ...extra, reserva: reserva ? publica(reserva) : null }), reloj(),
    );
  }

  function crear(d) {
    const ahora = reloj();
    const nombre = String(d.nombre || "").trim();
    const telefono = String(d.telefono || "").replace(/[^\d+]/g, "");
    if (nombre.length < 2) throw new ErrorReserva("FALTA_NOMBRE", "Falta el nombre de la reserva.");
    if (telefono.replace(/\D/g, "").length < 8) throw new ErrorReserva("FALTA_TELEFONO", "Falta un teléfono válido.");
    const personas = validarPersonas(d.personas);
    const canal = CANALES.includes(d.canal) ? d.canal : "web";
    const creadoPor = CREADORES.includes(d.creado_por) ? d.creado_por : "web";
    const tipo = tipoPara(personas);
    validarFecha(d.fecha);
    const inicio = aMin(d.hora);
    if (Number.isNaN(inicio)) throw new ErrorReserva("HORA_INVALIDA", "La hora debe tener formato HH:MM.");

    const duplicada = db
      .prepare(
        `SELECT * FROM reservas WHERE telefono = ? AND fecha = ? AND estado IN ('confirmada','pendiente','solicitud')`,
      )
      .get(telefono, d.fecha);
    if (duplicada)
      throw new ErrorReserva("DUPLICADA", "Ya existe una reserva activa con ese teléfono para ese día.",
        { reserva: publica(duplicada) }, 409);

    let estado, mesas = [], venceEn = null;
    if (tipo === "evento") {
      estado = "solicitud";
    } else {
      if (!horariosDelDia(d.fecha).includes(inicio))
        throw new ErrorReserva("HORA_FUERA_DE_SERVICIO", "Esa hora no está disponible para reservar.",
          { alternativas: alternativas(d.fecha, inicio, personas) });
      mesas = asignar(d.fecha, inicio, personas, { permitirVip: tipo === "grupo" });
      if (!mesas)
        throw new ErrorReserva("SIN_DISPONIBILIDAD", "No hay mesa para ese horario.",
          { alternativas: alternativas(d.fecha, inicio, personas) });
      estado = tipo === "individual" ? "confirmada" : "pendiente";
      if (tipo === "grupo") venceEn = ahora + R.horasRetencionGrupoPendiente * 3600000;
    }

    let codigo;
    do codigo = nuevoCodigo(); while (porCodigo(codigo));

    const r = db.prepare(
      `INSERT INTO reservas (codigo, nombre, telefono, correo, personas, fecha, inicio_min, fin_min, mesas, tipo, estado,
         canal, creado_por, idioma, ocasion, notas, conversacion_id, fuera_de_horario, vence_en, creada_en, actualizada_en)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).run(
      codigo, nombre, telefono, d.correo || null, personas, d.fecha, inicio, inicio + duracion(personas),
      JSON.stringify(mesas), tipo, estado, canal, creadoPor, d.idioma === "en" ? "en" : "es",
      d.ocasion || null, d.notas || null, d.conversacion_id ? String(d.conversacion_id) : null,
      fueraDeHorario(ahora) ? 1 : 0, venceEn, ahora, ahora,
    );
    const nueva = fila(Number(r.lastInsertRowid));
    emitir(
      estado === "confirmada" ? "reserva.confirmada" : estado === "pendiente" ? "grupo.pendiente_aprobacion" : "evento.solicitud",
      nueva,
    );
    return nueva;
  }

  const TRANSICIONES = {
    aprobar:   { desde: ["pendiente", "solicitud"], a: "confirmada", evento: "reserva.confirmada" },
    rechazar:  { desde: ["pendiente", "solicitud"], a: "rechazada", evento: "reserva.rechazada" },
    cancelar:  { desde: ["confirmada", "pendiente", "solicitud"], a: "cancelada", evento: "reserva.cancelada" },
    sentar:    { desde: ["confirmada"], a: "sentada", evento: null },
    completar: { desde: ["sentada", "confirmada"], a: "completada", evento: null },
    no_show:   { desde: ["confirmada"], a: "no_show", evento: "reserva.no_show" },
  };

  function cambiarEstado(codigo, accion, { motivo, mesas } = {}) {
    const t = TRANSICIONES[accion];
    if (!t) throw new ErrorReserva("ACCION_INVALIDA", `Acción desconocida: ${accion}`, {}, 400);
    const r = porCodigo(codigo);
    if (!r) throw new ErrorReserva("NO_ENCONTRADA", "No encontré esa reserva.", {}, 404);
    if (!t.desde.includes(r.estado))
      throw new ErrorReserva("ESTADO_INVALIDO", `No se puede ${accion} una reserva en estado "${r.estado}".`, {}, 409);
    let nuevasMesas = r.mesas;
    if (accion === "aprobar" && (mesas || r.tipo === "evento")) {
      nuevasMesas = JSON.stringify(Array.isArray(mesas) ? mesas : JSON.parse(r.mesas));
    }
    db.prepare(
      "UPDATE reservas SET estado = ?, mesas = ?, notas = COALESCE(?, notas), vence_en = NULL, actualizada_en = ? WHERE id = ?",
    ).run(t.a, nuevasMesas, motivo ? `${r.notas ? r.notas + " | " : ""}${accion}: ${motivo}` : null, reloj(), r.id);
    const nueva = fila(r.id);
    if (t.evento) emitir(t.evento, nueva, motivo ? { motivo } : {});
    return nueva;
  }

  function cancelarPorCliente(codigo, telefono) {
    const r = porCodigo(codigo);
    const tel = String(telefono || "").replace(/\D/g, "");
    if (!r || !tel || !r.telefono.replace(/\D/g, "").endsWith(tel.slice(-8)))
      throw new ErrorReserva("NO_ENCONTRADA", "No encontré una reserva con ese código y teléfono.", {}, 404);
    return cambiarEstado(codigo, "cancelar", { motivo: "cancelada por el cliente" });
  }

  function buscarPorTelefono(telefono) {
    const tel = String(telefono || "").replace(/\D/g, "").slice(-8);
    if (tel.length < 8) throw new ErrorReserva("FALTA_TELEFONO", "Teléfono inválido.");
    const hoy = ahoraLocal(zona, reloj()).fecha;
    return db
      .prepare(
        `SELECT * FROM reservas WHERE substr(replace(replace(telefono,'+',''),' ',''), -8) = ? AND fecha >= ?
         ORDER BY fecha, inicio_min`,
      )
      .all(tel, hoy)
      .map(publica);
  }

  function delDia(fecha) {
    return db.prepare("SELECT * FROM reservas WHERE fecha = ? ORDER BY inicio_min, id").all(fecha).map(publica);
  }

  function pendientes() {
    return db
      .prepare("SELECT * FROM reservas WHERE estado IN ('pendiente','solicitud') ORDER BY fecha, inicio_min")
      .all()
      .map(publica);
  }

  /** Recordatorios y seguimiento. Llamar cada minuto. Devuelve cuántos eventos generó. */
  function tic() {
    const ahora = reloj();
    let n = 0;
    const activas = db.prepare("SELECT * FROM reservas WHERE estado IN ('confirmada','sentada','completada','pendiente')").all();
    for (const r of activas) {
      const ini = instante(zona, r.fecha, r.inicio_min);
      const fin = instante(zona, r.fecha, r.fin_min);
      const marcar = (col) => db.prepare(`UPDATE reservas SET ${col} = 1 WHERE id = ?`).run(r.id);
      if (r.estado === "confirmada") {
        if (!r.rec24_enviado && ahora >= ini - 24 * 3600000 && ahora < ini - 3 * 3600000) {
          // Solo si se reservó con más de 24 h; si no, el de 3 h basta.
          if (r.creada_en <= ini - 24 * 3600000) { emitir("recordatorio.24h", r); n++; }
          marcar("rec24_enviado");
        } else if (!r.rec3_enviado && ahora >= ini - 3 * 3600000 && ahora < ini) {
          if (r.creada_en <= ini - 4 * 3600000) { emitir("recordatorio.3h", r); n++; }
          marcar("rec3_enviado");
          marcar("rec24_enviado");
        }
      }
      if (["sentada", "completada", "confirmada"].includes(r.estado) && !r.resena_enviada && ahora >= fin + 2 * 3600000) {
        // Si nadie la marcó como no-show, se asume que vino. El equipo puede corregir antes.
        if (r.estado !== "completada") db.prepare("UPDATE reservas SET estado='completada' WHERE id=?").run(r.id);
        emitir("post_visita.resena", fila(r.id));
        marcar("resena_enviada");
        n++;
      }
      if (r.estado === "pendiente" && r.vence_en && ahora >= r.vence_en && !r.vencida_avisada) {
        emitir("grupo.aprobacion_vencida", r);
        marcar("vencida_avisada");
        n++;
      }
    }
    return n;
  }

  /** Números para el reporte de ROI. Rango por fecha de creación (local), inclusive. */
  function metricas(desde, hasta) {
    if (!fechaValida(desde) || !fechaValida(hasta)) throw new ErrorReserva("FECHA_INVALIDA", "Rango de fechas inválido.");
    const a = instante(zona, desde, 0), b = instante(zona, sumarDias(hasta, 1), 0);
    const filas = db.prepare("SELECT * FROM reservas WHERE creada_en >= ? AND creada_en < ?").all(a, b);
    const ticket = config.ticketPromedioPorPersona;
    const reales = (r) => ["confirmada", "sentada", "completada"].includes(r.estado);
    const suma = (arr, f = () => true) => arr.filter(f).reduce((s, r) => s + r.personas, 0);
    const contar = (arr, k) => arr.reduce((o, r) => ((o[r[k]] = (o[r[k]] || 0) + 1), o), {});
    const sofia = filas.filter((r) => r.creado_por !== "equipo");
    const noche = sofia.filter((r) => r.fuera_de_horario);
    const conRecordatorio = filas.filter((r) => r.rec24_enviado || r.rec3_enviado);
    return {
      rango: { desde, hasta },
      ticketPromedioPorPersona: ticket,
      reservas: filas.length,
      porEstado: contar(filas, "estado"),
      porCanal: contar(filas, "canal"),
      porCreador: contar(filas, "creado_por"),
      porTipo: contar(filas, "tipo"),
      automaticas: {
        reservas: sofia.length,
        comensales: suma(sofia, reales),
        ingresoEstimado: suma(sofia, reales) * ticket,
      },
      fueraDeHorario: {
        reservas: noche.length,
        comensales: suma(noche, reales),
        ingresoEstimado: suma(noche, reales) * ticket,
      },
      noShows: filas.filter((r) => r.estado === "no_show").length,
      tasaNoShowConRecordatorio: conRecordatorio.length
        ? +(conRecordatorio.filter((r) => r.estado === "no_show").length / conRecordatorio.length).toFixed(3)
        : null,
      cancelaciones: filas.filter((r) => r.estado === "cancelada").length,
      grupos: {
        solicitados: filas.filter((r) => r.tipo === "grupo").length,
        aprobados: filas.filter((r) => r.tipo === "grupo" && reales(r)).length,
      },
      eventos: {
        solicitados: filas.filter((r) => r.tipo === "evento").length,
        aprobados: filas.filter((r) => r.tipo === "evento" && reales(r)).length,
      },
    };
  }

  return {
    disponibilidad, crear, cambiarEstado, cancelarPorCliente, buscarPorTelefono, delDia, pendientes, tic, metricas,
    porCodigo: (c) => { const r = porCodigo(c); return r && publica(r); },
    tipoPara, duracion,
  };
}

/** Forma que sale por la API (sin columnas internas). */
export function publica(r) {
  return {
    codigo: r.codigo,
    nombre: r.nombre,
    telefono: r.telefono,
    correo: r.correo,
    personas: r.personas,
    fecha: r.fecha,
    hora: aHora(r.inicio_min),
    hasta: aHora(r.fin_min),
    mesas: JSON.parse(r.mesas),
    tipo: r.tipo,
    estado: r.estado,
    canal: r.canal,
    creado_por: r.creado_por,
    idioma: r.idioma,
    ocasion: r.ocasion,
    notas: r.notas,
    conversacion_id: r.conversacion_id,
    fuera_de_horario: !!r.fuera_de_horario,
    creada_en: new Date(r.creada_en).toISOString(),
  };
}
