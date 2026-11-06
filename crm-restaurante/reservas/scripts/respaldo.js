// Copia de seguridad de la base de reservas. Pensado como "Scheduled Task" diario en Coolify:
//   node scripts/respaldo.js
// Guarda /data/respaldos/reservas-AAAA-MM-DD.db y conserva los últimos 14 días.
import { DatabaseSync, backup } from "node:sqlite";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const origen = process.env.DB_PATH || "/data/reservas.db";
const carpeta = process.env.RESPALDOS_DIR || join(dirname(origen), "respaldos");
const conservar = Number(process.env.RESPALDOS_DIAS || 14);
mkdirSync(carpeta, { recursive: true });

const destino = join(carpeta, `reservas-${new Date().toISOString().slice(0, 10)}.db`);
const db = new DatabaseSync(origen, { readOnly: true });
await backup(db, destino);
db.close();

const viejos = readdirSync(carpeta).filter((f) => /^reservas-\d{4}-\d{2}-\d{2}\.db$/.test(f)).sort().slice(0, -conservar);
for (const f of viejos) rmSync(join(carpeta, f));
console.log(`Respaldo listo: ${destino} (${viejos.length} antiguos borrados)`);
