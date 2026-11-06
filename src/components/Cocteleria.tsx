import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cocteles } from "../data";
import { useSplitChars } from "../useSplitChars";
import { useLang } from "../i18n";

/** Cocktails: columns drifting at different speeds (3 on desktop, all 9 photos in 2 columns on phones). */
export default function Cocteleria() {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { t, lang } = useLang();
  useSplitChars(title, { scroll: true });

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".k-col").forEach((col) => {
      const s = Number(col.dataset.speed);
      gsap.fromTo(col, { yPercent: -s / 2 }, { yPercent: s / 2, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }, { scope: ref });

  const all = cocteles.flat();
  const mobile = [all.filter((_, i) => i % 2 === 0), all.filter((_, i) => i % 2 === 1)];
  const Col = ({ items, speed, className = "" }: { items: typeof all; speed: number; className?: string }) => (
    <div data-speed={speed} className={`k-col flex flex-col gap-3 md:gap-6 ${className}`}>
      {items.map((c) => (
        <figure key={c.img} className="group relative overflow-hidden">
          <img src={c.img} alt={c.name ?? t(["Coctel de autor", "Signature cocktail"])} loading="lazy"
            className="w-full aspect-square object-cover object-top transition-transform duration-[2s] group-hover:scale-110"
            style={{ transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)" }} />
          {c.name && (
            <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
              <span className="font-accent italic text-[19px] md:text-[28px]">{c.name}</span>
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );

  return (
    <section id="cocteleria" ref={ref} className="relative bg-black text-[#EDE5D6] py-24 md:py-40 overflow-hidden">
      <div className="text-center px-6 mb-16 md:mb-24 relative z-10">
        <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-6">{t(["Mixología de autor", "Signature mixology"])}</p>
        <h2 key={lang} ref={title} className="invisible font-accent text-[44px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]">{t(["El arte de la barra", "The art of the bar"])}</h2>
        <p className="font-luxurious text-[34px] md:text-[48px] text-[#EDE5D6]/70 mt-2">{t(["humo, fuego y una copa bien servida", "smoke, fire and a well-poured glass"])}</p>
      </div>
      <div className="hidden md:grid grid-cols-3 gap-6 w-[76%] mx-auto">
        {cocteles.map((col, ci) => <Col key={ci} items={col} speed={[-12, 10, -20][ci]} className={ci === 1 ? "mt-32" : ""} />)}
      </div>
      <div className="grid md:hidden grid-cols-2 gap-3 w-[92%] mx-auto">
        {mobile.map((col, ci) => <Col key={ci} items={col} speed={ci ? 8 : -8} className={ci === 1 ? "mt-16" : ""} />)}
      </div>
    </section>
  );
}
