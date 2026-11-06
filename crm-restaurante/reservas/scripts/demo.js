// Demo local: crea una base con 3 semanas de reservas de ejemplo y levanta el servidor.
// Uso: npm run demo   →  http://localhost:3100/panel  (llave: demo-demo-demo-demo-demo-demo)
import { createServer } from "node:http";
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { abrirDB } from "../src/db.js";
import { crearMotor } from "../src/motor.js";
import { crearApp } from "../src/server.js";
import { ahoraLocal, sumarDias, instante } from "../src/tiempo.js";

const AQUI = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(AQUI, "..", "config.json"), "utf8"));
const ruta = join(AQUI, "..", "datos", "demo.db");
rmSync(ruta, { force: true }); rmSync(ruta + "-wal", { force: true }); rmSync(ruta + "-shm", { force: true });
const db = abrirDB(ruta);
const KEY = process.env.API_KEY || "demo-demo-demo-demo-demo-demo";

const nombres = ["Ana Mora", "Luis Vargas", "Sofía Rojas", "Carlos Jiménez", "María Solís", "John Smith", "Daniela Castro",
  "Andrés Quesada", "Laura Méndez", "Pablo Araya", "Emily Brown", "Jorge Chaves", "Valeria Núñez", "Diego Calderón"];
const canales = ["whatsapp", "whatsapp", "whatsapp", "instagram", "instagram", "messenger", "web"];
let semilla = 7; const azar = (n) => ((semilla = (semilla * 16807) % 2147483647) % n);

const hoy = ahoraLocal(config.zonaHoraria).fecha;
let tel = 60000000, creadas = 0;
for (let d = -21; d <= 7; d++) {
  const fecha = sumarDias(hoy, d);
  const n = 6 + azar(8);
  for (let i = 0; i < n; i++) {
    const personas = [2, 2, 2, 3, 4, 4, 5, 6, 8, 10][azar(10)];
    // Hora en que el cliente escribió: 1-3 días antes; 35 % de noche (22:00-02:00).
    const diasAntes = 1 + azar(3);
    const nocturna = azar(100) < 35;
    const minEscribio = nocturna ? (22 * 60 + azar(240)) % 1440 : 11 * 60 + azar(600);
    const creada = instante(config.zonaHoraria, sumarDias(fecha, -diasAntes), minEscribio);
    const motor = crearMotor({ db, config, reloj: () => creada });
    const canal = canales[azar(canales.length)];
    const hora = ["13:00", "13:30", "19:00", "19:30", "20:00", "20:30"][azar(6)];
    try {
      const r = motor.crear({
        nombre: nombres[azar(nombres.length)], telefono: `+506 ${tel++}`, personas, fecha, hora, canal,
        creado_por: canal === "web" ? "web" : azar(10) < 8 ? "sofia" : "equipo",
        ocasion: azar(8) === 0 ? "cumpleaños" : null,
      });
      creadas++;
      if (r.estado === "pendiente" && d < 0) motor.cambiarEstado(r.codigo, "aprobar");
      if (d < 0) {
        const x = azar(100);
        if (x < 4) motor.cambiarEstado(r.codigo, "no_show");
        else if (x < 9) motor.cambiarEstado(r.codigo, "cancelar", { motivo: "cliente" });
      }
    } catch { /* horario lleno o fuera de servicio: se omite */ }
  }
}
crearMotor({ db, config }).tic();
db.prepare("UPDATE eventos SET enviado = 1").run();
console.log(`Base demo con ${creadas} reservas en ${ruta}`);

const { manejar } = crearApp({ config, db, apiKey: KEY });
const puerto = Number(process.env.PORT || 3100);
createServer(manejar).listen(puerto, () => {
  console.log(`\nPanel:           http://localhost:${puerto}/panel   (llave: ${KEY})`);
  console.log(`Reserva pública: http://localhost:${puerto}/reservar\n`);
});
