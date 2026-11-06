import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { abrirDB } from "../src/db.js";
import { crearMotor } from "../src/motor.js";
import { crearApp } from "../src/server.js";
import { instante } from "../src/tiempo.js";

const config = JSON.parse(readFileSync(new URL("../config.json", import.meta.url)));
// Martes 10-nov-2026, 23:40 hora Costa Rica: el caso de "escriben a medianoche".
const NOCHE = instante("-06:00", "2026-11-10", 23 * 60 + 40);

function nuevo(ahora = NOCHE) {
  const db = abrirDB(":memory:");
  let t = ahora;
  const reloj = () => t;
  return { db, motor: crearMotor({ db, config, reloj }), avanzar: (ms) => (t += ms), fijar: (v) => (t = v) };
}
const base = { nombre: "Ana Mora", telefono: "+506 8888-1111", canal: "whatsapp", creado_por: "sofia" };

test("individual se confirma sola y cuenta como fuera de horario", () => {
  const { motor } = nuevo();
  const r = motor.crear({ ...base, personas: 2, fecha: "2026-11-11", hora: "20:00" });
  assert.equal(r.estado, "confirmada");
  assert.equal(r.tipo, "individual");
  assert.equal(r.fuera_de_horario, 1);
  assert.deepEqual(JSON.parse(r.mesas), ["M1"]);
});

test("grupo de 10 queda pendiente con mesas apartadas", () => {
  const { motor } = nuevo();
  const r = motor.crear({ ...base, personas: 10, fecha: "2026-11-13", hora: "20:00" });
  assert.equal(r.estado, "pendiente");
  assert.equal(r.tipo, "grupo");
  assert.ok(JSON.parse(r.mesas).length >= 1);
  assert.equal(motor.pendientes().length, 1);
  const ok = motor.cambiarEstado(r.codigo, "aprobar");
  assert.equal(ok.estado, "confirmada");
});

test("más de 15 personas es solicitud de evento", () => {
  const { motor } = nuevo();
  const r = motor.crear({ ...base, personas: 30, fecha: "2026-11-20", hora: "19:00" });
  assert.equal(r.tipo, "evento");
  assert.equal(r.estado, "solicitud");
});

test("sin mesa devuelve alternativas", () => {
  const { motor } = nuevo();
  // Llenar toda la capacidad para 2 personas a las 20:00
  let i = 0;
  for (;;) {
    try {
      motor.crear({ ...base, telefono: `+506 7000-${String(1000 + i++)}`, personas: 2, fecha: "2026-11-14", hora: "20:00" });
    } catch (e) {
      assert.equal(e.codigo, "SIN_DISPONIBILIDAD");
      assert.ok(e.extra.alternativas.length > 0);
      assert.ok(!e.extra.alternativas.some((a) => a.fecha === "2026-11-14" && a.hora === "20:00"));
      break;
    }
    assert.ok(i < 50);
  }
  assert.ok(!motor.disponibilidad("2026-11-14", 2).horarios.includes("20:00"));
});

test("reglas de calendario: pasado, cerrado por hora, duplicada", () => {
  const { motor } = nuevo();
  assert.throws(() => motor.crear({ ...base, personas: 2, fecha: "2026-11-09", hora: "20:00" }), { codigo: "FECHA_PASADA" });
  assert.throws(() => motor.crear({ ...base, personas: 2, fecha: "2026-11-11", hora: "22:30" }), { codigo: "HORA_FUERA_DE_SERVICIO" });
  motor.crear({ ...base, personas: 2, fecha: "2026-11-11", hora: "13:00" });
  assert.throws(() => motor.crear({ ...base, personas: 4, fecha: "2026-11-11", hora: "19:00" }), { codigo: "DUPLICADA" });
});

test("domingo cierra a las 21:00: última reserva 20:00", () => {
  const { motor } = nuevo();
  const h = motor.disponibilidad("2026-11-15", 2).horarios;
  assert.equal(h[0], "12:00");
  assert.equal(h.at(-1), "20:00");
});

test("recordatorios 24h y 3h, luego reseña", () => {
  const { db, motor, fijar } = nuevo();
  const r = motor.crear({ ...base, personas: 4, fecha: "2026-11-13", hora: "20:00" });
  const ini = instante("-06:00", "2026-11-13", 20 * 60);
  const tipos = () => db.prepare("SELECT tipo FROM eventos ORDER BY id").all().map((e) => e.tipo);
  fijar(ini - 23 * 3600000); motor.tic();
  fijar(ini - 2 * 3600000); motor.tic();
  fijar(ini + 6 * 3600000); motor.tic(); motor.tic();
  assert.deepEqual(tipos(), ["reserva.confirmada", "recordatorio.24h", "recordatorio.3h", "post_visita.resena"]);
  assert.equal(motor.porCodigo(r.codigo).estado, "completada");
});

test("métricas de ROI", () => {
  const { motor } = nuevo();
  motor.crear({ ...base, personas: 2, fecha: "2026-11-11", hora: "20:00" });
  motor.crear({ ...base, telefono: "+50670001111", personas: 4, fecha: "2026-11-12", hora: "20:00", creado_por: "equipo", canal: "telefono" });
  const m = motor.metricas("2026-11-10", "2026-11-10");
  assert.equal(m.reservas, 2);
  assert.equal(m.fueraDeHorario.reservas, 1);
  assert.equal(m.fueraDeHorario.comensales, 2);
  assert.equal(m.fueraDeHorario.ingresoEstimado, 50);
  assert.equal(m.automaticas.reservas, 1);
});

test("API: requiere llave y crea reserva", async () => {
  const db = abrirDB(":memory:");
  const { manejar } = crearApp({ config, db, apiKey: "k".repeat(32), reloj: () => NOCHE });
  const { createServer } = await import("node:http");
  const srv = createServer(manejar).listen(0);
  const url = `http://localhost:${srv.address().port}`;
  try {
    let res = await fetch(`${url}/api/disponibilidad?fecha=2026-11-11&personas=2`);
    assert.equal(res.status, 401);
    res = await fetch(`${url}/api/reservas`, {
      method: "POST",
      headers: { authorization: `Bearer ${"k".repeat(32)}`, "content-type": "application/json" },
      body: JSON.stringify({ ...base, personas: 3, fecha: "2026-11-11", hora: "19:30" }),
    });
    assert.equal(res.status, 201);
    const j = await res.json();
    assert.match(j.mensaje_sugerido, /Mesa para 3/);
    res = await fetch(`${url}/public/reservas/${j.reserva.codigo}/cancelar`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ telefono: "88881111" }),
    });
    assert.equal((await res.json()).reserva.estado, "cancelada");
  } finally {
    srv.close();
  }
});
