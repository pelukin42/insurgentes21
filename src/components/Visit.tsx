import { asset } from "../asset";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { INFO } from "../data";
import { useLang } from "../i18n";

/** Reservations, hours and location, next to the facade. */
export default function Visit() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useGSAP(() => {
    gsap.fromTo(".v-mask", { clipPath: "inset(10% 10% 10% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: true } });
    gsap.fromTo(".v-line", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".v-copy", start: "top 80%", once: true } });
  }, { scope: ref });

  return (
    <section id="visitanos" ref={ref} className="bg-[#EDE5D6] text-black grid md:grid-cols-2 min-h-screen">
      <div className="v-mask relative h-[70vh] md:h-auto overflow-hidden">
        <img src={asset("/img/fachada/fachada-02_DW4Ng9KCVP_.jpg")} alt={t(["Fachada de Insurgentes 21", "Insurgentes 21 façade"])} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="v-copy flex flex-col justify-center px-6 md:pl-[8%] md:pr-[9%] py-20">
        <p className="v-line font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-6">{t(["Visitanos", "Visit us"])}</p>
        <h2 className="v-line font-accent text-[48px] md:text-[5vw] leading-[0.95] tracking-[-0.03em]">{t(["Una mesa para quedarse", "A table to linger at"])}</h2>
        <p className="v-line font-body font-light text-[16px] leading-8 text-black/60 mt-6 max-w-[460px]">
          {t(["Comidas de negocios, celebraciones y eventos privados en nuestro Salón VIP. Reservá tu mesa y te atendemos personalmente.", "Business lunches, celebrations and private events in our VIP room. Book your table and we will look after you personally."])}
        </p>

        <div className="v-line grid sm:grid-cols-2 gap-8 mt-10 border-t border-black/10 pt-8">
          <div>
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-black/40 mb-3">{t(["Horario", "Hours"])}</p>
            <dl className="space-y-2 text-[14px]">
              {INFO.hours.map(([d, h]) => (
                <div key={t(d)}><dt className="font-semibold">{t(d)}</dt><dd className="text-black/60">{t(h)}</dd></div>
              ))}
            </dl>
          </div>
          <div>
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-black/40 mb-3">{t(["Ubicación", "Location"])}</p>
            <p className="text-[14px] font-semibold">{INFO.address}</p>
            <p className="text-[14px] text-black/60">{INFO.city}</p>
            <div className="flex gap-4 mt-3 text-[13px]">
              <a href={INFO.maps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 decoration-black/20 hover:text-[#EF5C32]"><MapPin className="w-3.5 h-3.5" /> Google Maps</a>
              <a href={INFO.waze} target="_blank" rel="noreferrer" className="underline underline-offset-4 decoration-black/20 hover:text-[#EF5C32]">Waze</a>
            </div>
            <p className="font-body text-[11px] tracking-[0.3em] uppercase text-black/40 mt-6 mb-2">{t(["Reservas", "Reservations"])}</p>
            <a href={INFO.whatsapp} target="_blank" rel="noreferrer" className="font-accent text-[26px] hover:text-[#EF5C32]">{INFO.phone}</a>
          </div>
        </div>

        <div className="v-line flex flex-wrap gap-4 mt-10">
          <a href={INFO.opentable} target="_blank" rel="noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-manrope text-sm tracking-wide hover:bg-[#EF5C32] transition-colors duration-300">
            {t(["Reservá en OpenTable", "Book on OpenTable"])} <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a href={INFO.whatsapp} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-black/20 font-manrope text-sm tracking-wide hover:border-[#EF5C32] hover:text-[#EF5C32] transition-colors duration-300">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
