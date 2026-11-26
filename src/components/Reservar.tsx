import { useEffect, useState } from "react";
import { track } from "../analytics";
import { useLang } from "../i18n";

/** Booking form wired to the restaurant's own CRM reservation system.
 *  Calls go to /api/reservas/* on this site; netlify.toml proxies them to the CRM. */
const API = "/api/reservas";

type Result = { estado: string; codigo: string; fecha: string; hora: string; personas: number };

const ESTADO: Record<string, [string, string]> = {
  confirmada: ["¡Tu mesa está confirmada!", "Your table is confirmed!"],
  pendiente: ["Recibimos tu solicitud. El equipo la confirmará pronto.", "We got your request. The team will confirm it shortly."],
  solicitud: ["Recibimos tu solicitud de evento. El equipo te contactará.", "We got your event request. The team will contact you."],
};

const errMsg = async (r: Response) => {
  try { const j = await r.json(); return typeof j.detail === "string" ? j.detail : null; } catch { return null; }
};

export default function Reservar() {
  const { t } = useLang();
  const [f, setF] = useState({ nombre: "", telefono: "", personas: 2, fecha: "", hora: "", notas: "", sitio: "" });
  const [horarios, setHorarios] = useState<string[]>([]);
  const [evento, setEvento] = useState(false);
  const [hoy, setHoy] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Result | null>(null);

  useEffect(() => {
    fetch(`${API}/info`).then((r) => r.json()).then((d) => { setHoy(d.hoy); setF((x) => ({ ...x, fecha: d.hoy })); })
      .catch(() => setError(t(["El sistema de reservas no está disponible. Escribinos por WhatsApp.", "Booking is unavailable right now. Message us on WhatsApp."])));
  }, []);

  useEffect(() => {
    if (!f.fecha || f.personas < 1) return;
    let live = true;
    fetch(`${API}/disponibilidad?fecha=${f.fecha}&personas=${f.personas}`).then((r) => r.json()).then((d) => {
      if (!live) return;
      const ev = d.tipo === "evento";
      setEvento(ev);
      setHorarios(d.horarios ?? []);
      setError(!ev && !(d.horarios ?? []).length ? t(["No quedan horarios ese día.", "No times left that day."]) : "");
      setF((x) => ({ ...x, hora: ev ? "12:00" : "" }));
    }).catch(() => live && setHorarios([]));
    return () => { live = false; };
  }, [f.fecha, f.personas]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true); setError("");
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, notas: f.notas || null }) });
      if (!r.ok) throw new Error((await errMsg(r)) ?? "");
      const d: Result = await r.json();
      setDone(d);
      track("reserva_crm", { estado: d.estado, personas: d.personas });
    } catch (err) {
      setError((err as Error).message || t(["No pudimos registrar la reserva. Intentá de nuevo.", "We couldn't save the booking. Please try again."]));
    } finally { setSending(false); }
  }

  const input = "w-full border border-black/20 bg-white px-4 py-3 font-manrope text-[15px] text-black focus:outline-none focus:border-[#EF5C32]";
  const label = "block text-[11px] tracking-[0.2em] uppercase text-black/50 mb-2";

  return (
    <section id="reservar" data-area="reservar" className="bg-[#F4EFE8] text-black py-24 md:py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#EF5C32] mb-4">{t(["Reservas", "Bookings"])}</p>
        <h2 className="font-accent text-[44px] md:text-[64px] leading-[0.95] tracking-[-0.03em] mb-10">{t(["Reservá tu mesa", "Book your table"])}</h2>

        {done ? (
          <div className="border border-black/15 bg-white p-8 text-center">
            <h3 className="font-accent text-[30px]">{t(ESTADO[done.estado] ?? ["Reserva recibida", "Booking received"])}</h3>
            <p className="mt-3">{done.fecha} · {done.hora} · {done.personas} {t(["personas", "guests"])}</p>
            <p className="mt-2">{t(["Tu código", "Your code"])}: <b>{done.codigo}</b></p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="md:col-span-2"><span className={label}>{t(["Nombre", "Name"])}</span>
              <input required className={input} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} autoComplete="name" /></label>
            <label><span className={label}>{t(["Teléfono / WhatsApp", "Phone / WhatsApp"])}</span>
              <input required type="tel" className={input} value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} autoComplete="tel" /></label>
            <label><span className={label}>{t(["Personas", "Guests"])}</span>
              <input required type="number" min={1} max={200} className={input} value={f.personas} onChange={(e) => setF({ ...f, personas: Number(e.target.value) })} /></label>
            <label><span className={label}>{t(["Fecha", "Date"])}</span>
              <input required type="date" min={hoy} className={input} value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} /></label>
            {!evento && (
              <label><span className={label}>{t(["Hora", "Time"])}</span>
                <select required className={input} value={f.hora} onChange={(e) => setF({ ...f, hora: e.target.value })}>
                  <option value="">{t(["Elegí un horario", "Pick a time"])}</option>
                  {horarios.map((h) => <option key={h} value={h}>{h}</option>)}
                </select></label>
            )}
            {evento && <p className="md:col-span-2 text-[14px] text-black/70">{t(["Para grupos grandes lo tratamos como evento: el equipo te contacta para coordinar.", "Large groups are handled as an event: the team will contact you."])}</p>}
            <label className="md:col-span-2"><span className={label}>{t(["Notas (opcional)", "Notes (optional)"])}</span>
              <textarea rows={3} className={input} value={f.notas} onChange={(e) => setF({ ...f, notas: e.target.value })} /></label>
            {/* honeypot: hidden from people, bots fill it */}
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={f.sitio} onChange={(e) => setF({ ...f, sitio: e.target.value })} />
            {error && <p className="md:col-span-2 text-[14px] text-[#C0392B]">{error}</p>}
            <button disabled={sending} className="md:col-span-2 px-8 py-4 bg-black text-white font-manrope text-sm tracking-wide hover:bg-[#EF5C32] transition-colors duration-300 disabled:opacity-50">
              {sending ? t(["Enviando…", "Sending…"]) : t(["Confirmar reserva", "Confirm booking"])}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
