// Utilidades de fecha y hora en la zona del restaurante (offset fijo; Costa Rica no usa horario de verano).

export function offsetMinutos(zona) {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(zona || "+00:00");
  if (!m) throw new Error(`zonaHoraria inválida: ${zona}`);
  const v = Number(m[2]) * 60 + Number(m[3]);
  return m[1] === "-" ? -v : v;
}

/** Fecha y hora local "ahora" como { fecha: 'YYYY-MM-DD', min: minutos desde medianoche, dia: 0-6 }. */
export function ahoraLocal(zona, ahora = Date.now()) {
  const d = new Date(ahora + offsetMinutos(zona) * 60000);
  return {
    fecha: d.toISOString().slice(0, 10),
    min: d.getUTCHours() * 60 + d.getUTCMinutes(),
    dia: d.getUTCDay(),
  };
}

export const aMin = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ""));
  if (!m) return NaN;
  const h = Number(m[1]), mm = Number(m[2]);
  if (h > 24 || mm > 59) return NaN;
  return h * 60 + mm;
};

export const aHora = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export function fechaValida(f) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f || ""))) return false;
  const d = new Date(`${f}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === f;
}

export const diaSemana = (fecha) => new Date(`${fecha}T00:00:00Z`).getUTCDay();

export function sumarDias(fecha, n) {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const diasEntre = (a, b) =>
  Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86400000);

/** Instante absoluto (ms) de una fecha+minuto local. */
export function instante(zona, fecha, min) {
  return Date.parse(`${fecha}T00:00:00Z`) + (min - offsetMinutos(zona)) * 60000;
}
