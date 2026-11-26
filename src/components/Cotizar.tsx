import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { INFO } from "../data";
import { track } from "../analytics";
import { useLang } from "../i18n";

/** Quote request: a short questionnaire, then hands the chat to the person who
 *  handles quotes (INFO.cotizaciones) on WhatsApp with every answer pre-filled. */
const TIPOS: [string, string][] = [
  ["Evento privado / Salón VIP", "Private event / VIP room"],
  ["Cumpleaños o celebración", "Birthday or celebration"],
  ["Cena o almuerzo de empresa", "Company dinner or lunch"],
  ["Lanzamiento o activación de marca", "Launch or brand activation"],
  ["Otro servicio", "Other service"],
];
const PRESUPUESTO: [string, string][] = [
  ["Menos de ₡15.000 por persona", "Under ₡15,000 per guest"],
  ["₡15.000 – ₡25.000 por persona", "₡15,000 – ₡25,000 per guest"],
  ["Más de ₡25.000 por persona", "Over ₡25,000 per guest"],
  ["Todavía no lo sé", "Not sure yet"],
];

export default function Cotizar() {
  const { t } = useLang();
  const [f, setF] = useState({ tipo: "", fecha: "", personas: "", presupuesto: "", detalles: "", nombre: "", telefono: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = [
      "Hola, quiero cotizar en Insurgentes 21 (solicitud desde la página web):",
      `• Servicio: ${f.tipo}`,
      `• Fecha: ${f.fecha}`,
      `• Personas: ${f.personas}`,
      `• Presupuesto: ${f.presupuesto}`,
      f.detalles && `• Detalles: ${f.detalles}`,
      `• Nombre: ${f.nombre}`,
      `• Teléfono: ${f.telefono}`,
    ].filter(Boolean).join("\n");
    track("cotizar_evento", { tipo: f.tipo, personas: Number(f.personas) || 0 });
    window.open(`${INFO.cotizaciones}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  const input = "w-full border border-white/20 bg-transparent px-4 py-3 font-manrope text-[15px] text-[#EDE5D6] focus:outline-none focus:border-[#EF5C32] [color-scheme:dark]";
  const label = "block text-[11px] tracking-[0.2em] uppercase text-[#B08A5B] mb-2";
  const opt = "bg-[#141110] text-[#EDE5D6]";

  return (
    <section id="cotizar" data-area="cotizar" className="bg-[#141110] text-[#EDE5D6] py-24 md:py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#EF5C32] mb-4">{t(["Cotizaciones", "Quotes"])}</p>
        <h2 className="font-accent text-[44px] md:text-[64px] leading-[0.95] tracking-[-0.03em]">{t(["Cotizá tu evento", "Get a quote"])}</h2>
        <p className="font-body font-light text-[15px] leading-7 text-[#EDE5D6]/70 mt-4 mb-10">
          {t(["Contanos lo básico y te pasamos directo con nuestro encargado de eventos por WhatsApp, con todo ya escrito.",
            "Tell us the basics and we'll connect you with our events manager on WhatsApp, with everything already filled in."])}
        </p>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="md:col-span-2"><span className={label}>{t(["1. ¿Qué querés cotizar?", "1. What would you like a quote for?"])}</span>
            <select required className={input} value={f.tipo} onChange={set("tipo")}>
              <option className={opt} value="">{t(["Elegí una opción", "Choose one"])}</option>
              {TIPOS.map((o) => <option className={opt} key={o[0]} value={o[0]}>{t(o)}</option>)}
            </select></label>
          <label><span className={label}>{t(["2. ¿Para qué fecha?", "2. What date?"])}</span>
            <input required type="date" className={input} value={f.fecha} onChange={set("fecha")} /></label>
          <label><span className={label}>{t(["3. ¿Cuántas personas?", "3. How many guests?"])}</span>
            <input required type="number" min={1} className={input} value={f.personas} onChange={set("personas")} /></label>
          <label className="md:col-span-2"><span className={label}>{t(["4. Presupuesto aproximado", "4. Approximate budget"])}</span>
            <select required className={input} value={f.presupuesto} onChange={set("presupuesto")}>
              <option className={opt} value="">{t(["Elegí una opción", "Choose one"])}</option>
              {PRESUPUESTO.map((o) => <option className={opt} key={o[0]} value={o[0]}>{t(o)}</option>)}
            </select></label>
          <label className="md:col-span-2"><span className={label}>{t(["5. Contanos más (opcional)", "5. Tell us more (optional)"])}</span>
            <textarea rows={3} className={input} value={f.detalles} onChange={set("detalles")}
              placeholder={t(["Horario, menú, bebidas, decoración, música…", "Time, menu, drinks, decor, music…"])} /></label>
          <label><span className={label}>{t(["Nombre", "Name"])}</span>
            <input required className={input} value={f.nombre} onChange={set("nombre")} autoComplete="name" /></label>
          <label><span className={label}>{t(["Teléfono", "Phone"])}</span>
            <input required type="tel" className={input} value={f.telefono} onChange={set("telefono")} autoComplete="tel" /></label>
          <button className="md:col-span-2 inline-flex justify-center items-center gap-3 px-8 py-4 bg-[#EF5C32] text-white font-manrope text-sm tracking-wide hover:bg-[#d84a22] transition-colors">
            <MessageCircle className="w-4 h-4" /> {t(["Enviar y continuar por WhatsApp", "Send and continue on WhatsApp"])}
          </button>
        </form>
      </div>
    </section>
  );
}
