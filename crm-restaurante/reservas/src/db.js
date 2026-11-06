import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function abrirDB(ruta) {
  if (ruta !== ":memory:") mkdirSync(dirname(ruta), { recursive: true });
  const db = new DatabaseSync(ruta);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS reservas (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo          TEXT NOT NULL UNIQUE,
      nombre          TEXT NOT NULL,
      telefono        TEXT NOT NULL,
      correo          TEXT,
      personas        INTEGER NOT NULL,
      fecha           TEXT NOT NULL,            -- YYYY-MM-DD local
      inicio_min      INTEGER NOT NULL,         -- minutos desde medianoche local
      fin_min         INTEGER NOT NULL,
      mesas           TEXT NOT NULL DEFAULT '[]', -- JSON
      tipo            TEXT NOT NULL,            -- individual | grupo | evento
      estado          TEXT NOT NULL,            -- confirmada | pendiente | solicitud | sentada | completada | no_show | cancelada | rechazada
      canal           TEXT NOT NULL,            -- whatsapp | instagram | messenger | web | telefono | correo | presencial
      creado_por      TEXT NOT NULL,            -- sofia | web | equipo
      idioma          TEXT DEFAULT 'es',
      ocasion         TEXT,
      notas           TEXT,
      conversacion_id TEXT,
      fuera_de_horario INTEGER NOT NULL DEFAULT 0,
      vence_en        INTEGER,                  -- ms; solo grupos pendientes
      creada_en       INTEGER NOT NULL,         -- ms
      actualizada_en  INTEGER NOT NULL,
      rec24_enviado   INTEGER NOT NULL DEFAULT 0,
      rec3_enviado    INTEGER NOT NULL DEFAULT 0,
      resena_enviada  INTEGER NOT NULL DEFAULT 0,
      vencida_avisada INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS ix_reservas_fecha ON reservas(fecha, estado);
    CREATE INDEX IF NOT EXISTS ix_reservas_tel ON reservas(telefono);
    CREATE INDEX IF NOT EXISTS ix_reservas_creada ON reservas(creada_en);

    -- Bandeja de salida: cada cambio importante genera un evento que el CRM / n8n recibe por webhook o consulta.
    CREATE TABLE IF NOT EXISTS eventos (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo      TEXT NOT NULL,
      reserva_id INTEGER REFERENCES reservas(id),
      datos     TEXT NOT NULL,
      creado_en INTEGER NOT NULL,
      enviado   INTEGER NOT NULL DEFAULT 0,
      intentos  INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS ix_eventos_pend ON eventos(enviado, id);
  `);
  return db;
}
