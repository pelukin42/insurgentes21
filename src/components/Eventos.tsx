import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, CalendarDays, Instagram } from "lucide-react";
import { asset } from "../asset";
import { INFO, recurring, upcoming } from "../data";
import { useSplitChars } from "../useSplitChars";
import { useLang } from "../i18n";

const today = () => new Date(new Date().toDateString());

/** Upcoming events, recurring afternoons/lunches and private events (Salón VIP). */
export default function Eventos() {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { t, lang } = useLang();
  useSplitChars(title, { scroll: true });
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".e-card").forEach((el) =>
      gsap.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
  }, { scope: ref });

  const next = upcoming
    .filter((e) => new Date(e.date + "T23:59:59") >= today())
    .sort((a, b) => a.date.localeCompare(b.date));
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(lang === "es" ? "es-CR" : "en-US", { weekday: "long", day: "numeric", month: "long" });
  const ext = (h: string) => (h.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});

  return (
    <section id="eventos" ref={ref} className="relative bg-[#14170F] text-[#EDE5D6] py-24 md:py-36">
      <div className="text-center px-6 mb-14 md:mb-20">
        <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-6">{t(["Agenda", "What's on"])}</p>
        <h2 key={lang} ref={title} className="invisible font-accent text-[44px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]">{t(["Próximos eventos", "Upcoming events"])}</h2>
      </div>

      <div className="w-[92%] md:w-[76%] mx-auto">
        {next.length > 0 ? (
          <ul className="divide-y divide-[#EDE5D6]/10 border-y border-[#EDE5D6]/10 mb-16 md:mb-24">
            {next.map((e) => (
              <li key={e.date + t(e.title)} className="e-card grid grid-cols-[88px_1fr] md:grid-cols-[180px_1fr_auto] gap-5 md:gap-10 py-6 items-center">
                <img src={e.img} alt="" className="w-[88px] md:w-[180px] aspect-square object-cover" />
                <div>
                  <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#B08A5B] capitalize">{fmt(e.date)}{e.time ? ` · ${t(e.time)}` : ""}</p>
                  <h3 className="font-accent text-[26px] md:text-[36px] leading-tight mt-1">{t(e.title)}</h3>
                  <p className="font-body font-light text-[14px] leading-6 text-[#EDE5D6]/60 mt-1">{t(e.desc)}</p>
                </div>
                <a href={INFO.whatsapp} target="_blank" rel="noreferrer" className="col-span-2 md:col-span-1 justify-self-start inline-flex items-center gap-2 px-6 py-3 border border-[#EDE5D6]/30 text-sm hover:bg-[#EF5C32] hover:border-[#EF5C32] transition-colors">
                  {t(["Reservar", "Book"])} <ArrowUpRight className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="e-card mb-16 md:mb-24 border border-dashed border-[#EDE5D6]/20 px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div className="flex items-center gap-4">
              <CalendarDays className="w-8 h-8 text-[#EF5C32] shrink-0" strokeWidth={1.3} />
              <p className="font-body font-light text-[15px] leading-7 text-[#EDE5D6]/70">
                {t(["Catas, noches de mezcal, música en vivo y menús de temporada. Anunciamos las fechas primero en Instagram.",
                  "Tastings, mezcal nights, live music and seasonal menus. We announce dates first on Instagram."])}
              </p>
            </div>
            <a href={INFO.instagram} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 border border-[#EDE5D6]/30 text-sm hover:bg-[#EF5C32] hover:border-[#EF5C32] transition-colors">
              <Instagram className="w-4 h-4" /> @insurgentes_21
            </a>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {recurring.map((r) => (
            <article key={r.href} className="e-card group relative overflow-hidden min-h-[440px] md:min-h-[520px] flex items-end">
              <img src={r.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              <div className="relative p-7 md:p-10">
                <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#B08A5B]">{t(r.when)}</p>
                <h3 className="font-accent text-[36px] md:text-[48px] leading-none mt-4">{t(r.title)}</h3>
                <p className="font-body font-light text-[15px] leading-7 text-[#EDE5D6]/75 mt-4 max-w-[460px]">{t(r.desc)}</p>
                <a href={r.href} {...ext(r.href)} className="inline-block mt-6 px-7 py-3 border border-[#EDE5D6]/40 font-manrope text-sm tracking-wide hover:bg-[#EF5C32] hover:border-[#EF5C32] transition-colors">{t(r.cta)}</a>
              </div>
            </article>
          ))}
        </div>

        <div id="privados" className="e-card mt-6 md:mt-10 grid md:grid-cols-[1.1fr_1fr] border border-[#B08A5B]/40 scroll-mt-20">
          <img src={asset("/img/ambiente/ambiente-03_DX2Ak6RDHdp.jpg")} alt={t(["Salón VIP", "VIP room"])} loading="lazy" className="w-full h-[260px] md:h-full object-cover" />
          <div className="px-7 md:px-12 py-10 md:py-14">
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#B08A5B]">{t(["Salón VIP · más de 14 invitados", "VIP room · 14+ guests"])}</p>
            <h3 className="font-accent text-[36px] md:text-[48px] leading-none mt-4">{t(["Eventos privados", "Private events"])}</h3>
            <p className="font-body font-light text-[15px] leading-7 text-[#EDE5D6]/70 mt-4">
              {t(["Cumpleaños, cenas de empresa, lanzamientos y celebraciones. Armamos un menú a la medida, con maridaje de nuestra cava y coctelería de autor.",
                "Birthdays, company dinners, launches and celebrations. We build a tailored menu, paired from our cellar and our signature bar."])}
            </p>
            <a href={`${INFO.whatsapp}?text=${encodeURIComponent(t(["Hola, quiero cotizar un evento privado en Insurgentes 21.", "Hi, I'd like a quote for a private event at Insurgentes 21."]))}`}
              target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-7 px-7 py-3 bg-[#EF5C32] text-white font-manrope text-sm tracking-wide hover:bg-[#d84a22] transition-colors">
              {t(["Cotizá tu evento", "Get a quote"])} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
