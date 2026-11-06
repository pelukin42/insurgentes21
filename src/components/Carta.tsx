import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, FileDown } from "lucide-react";
import { carta, INFO } from "../data";
import { useSplitChars } from "../useSplitChars";
import { useLang } from "../i18n";

ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Pinned horizontal scroll of signature dishes. Same on phone and desktop:
 * scrolling down moves the row sideways, so nobody misses a dish.
 */
export default function Carta() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { t, lang } = useLang();
  useSplitChars(title, { scroll: true });

  useGSAP(() => {
    const el = track.current!;
    const dist = () => Math.max(0, el.scrollWidth - window.innerWidth);
    const tween = gsap.to(el, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: section.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (st) => gsap.set(bar.current, { scaleX: st.progress }),
      },
    });
    gsap.utils.toArray<HTMLElement>(".c-img").forEach((img) =>
      gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none",
        scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }));
  }, { scope: section, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="carta" ref={section} className="relative bg-[#14170F] text-[#EDE5D6] overflow-hidden h-[100svh] md:h-screen flex items-center">
      <div ref={track} className="flex items-center gap-6 md:gap-12 pl-6 md:pl-[8vw] pr-6 md:pr-[12vw] w-max will-change-transform">
        <div className="shrink-0 w-[82vw] md:w-[34vw] pr-4">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-6">{t(["La Carta", "The Menu"])}</p>
          <h2 key={lang} ref={title} className="invisible font-accent text-[44px] md:text-[5.5vw] leading-[0.95] tracking-[-0.03em]">{t(["Del Josper a tu mesa", "From the Josper to your table"])}</h2>
          <p className="mt-6 md:mt-8 font-body font-light text-[15px] leading-7 text-[#EDE5D6]/60 max-w-[420px]">
            {t(["Brasa viva, producto premium y raíz mexicana. Una selección de los favoritos de nuestra mesa.",
              "Live fire, premium produce and Mexican roots. A selection of our table's favourites."])}
          </p>
          <div className="mt-8 md:mt-10 flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-[#EDE5D6]/50">
            <span className="h-px w-16 bg-[#EDE5D6]/30" /> {t(["Seguí bajando", "Keep scrolling"])}
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>
        </div>
        {carta.map((d, i) => (
          <article key={d.name} className={`shrink-0 w-[70vw] md:w-[26vw] ${i % 2 ? "mt-[8vh] md:mt-[14vh]" : "-mt-[6vh] md:-mt-[10vh]"}`}>
            <div className="relative aspect-[4/5] md:aspect-square overflow-hidden">
              <img src={d.img} alt={d.name} loading="lazy" className="c-img absolute inset-0 w-[116%] max-w-none h-full -left-[8%] object-cover object-top" />
            </div>
            <div className="mt-4 md:mt-5 flex items-baseline gap-4 border-t border-[#EDE5D6]/15 pt-3 md:pt-4">
              <span className="font-accent italic text-[#EF5C32] text-lg">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-accent text-[24px] md:text-[2vw] leading-tight">{d.name}</h3>
                <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#B08A5B] mt-1">{t(d.note)}</p>
                <p className="font-body font-light text-[13px] md:text-[14px] leading-6 text-[#EDE5D6]/60 mt-2 md:mt-3 max-w-[360px]">{t(d.desc)}</p>
              </div>
            </div>
          </article>
        ))}
        <div className="shrink-0 w-[70vw] md:w-[24vw] flex flex-col gap-4 items-start">
          <p className="font-accent text-[30px] md:text-[2.6vw] leading-tight">{t(["¿Con hambre de más?", "Hungry for more?"])}</p>
          <a href="#carta-completa" className="inline-flex items-center gap-3 px-7 py-3 bg-[#EF5C32] text-white font-manrope text-sm tracking-wide hover:bg-[#d84a22] transition-colors">
            {t(["Ver la carta completa", "See the full menu"])} <ArrowRight className="w-4 h-4" />
          </a>
          <a href={INFO.menuPdf} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-3 px-7 py-3 border border-[#EDE5D6]/30 font-manrope text-sm tracking-wide hover:border-[#EF5C32] hover:text-[#EF5C32] transition-colors">
            <FileDown className="w-4 h-4" /> {t(["Descargar menú (PDF)", "Download menu (PDF)"])}
          </a>
        </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6 md:left-[8vw] md:right-[8vw] h-px bg-[#EDE5D6]/15">
        <div ref={bar} className="h-full bg-[#EF5C32] origin-left scale-x-0" />
      </div>
    </section>
  );
}
