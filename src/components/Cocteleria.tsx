import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cocteles, INFO } from "../data";
import { useSplitChars } from "../useSplitChars";

/** Cocktails: three columns drifting at different speeds. */
export default function Cocteleria() {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useSplitChars(title, { scroll: true });

  useGSAP(() => {
    const speeds = [-12, 10, -20];
    gsap.utils.toArray<HTMLElement>(".k-col").forEach((col, i) =>
      gsap.fromTo(col, { yPercent: -speeds[i] / 2 }, { yPercent: speeds[i] / 2, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }));
  }, { scope: ref });

  return (
    <section id="cocteleria" ref={ref} className="relative bg-black text-[#EDE5D6] py-24 md:py-40 overflow-hidden">
      <div className="text-center px-6 mb-16 md:mb-24 relative z-10">
        <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-6">Mixología de autor</p>
        <h2 ref={title} className="invisible font-accent text-[44px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]">El arte de la barra</h2>
        <p className="font-luxurious text-[34px] md:text-[48px] text-[#EDE5D6]/70 mt-2">humo, fuego y una copa bien servida</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-[92%] md:w-[76%] mx-auto">
        {cocteles.map((col, ci) => (
          <div key={ci} className={`k-col flex flex-col gap-3 md:gap-6 ${ci === 2 ? "hidden md:flex" : ""} ${ci === 1 ? "mt-16 md:mt-32" : ""}`}>
            {col.map((c) => (
              <figure key={c.img} className="group relative overflow-hidden">
                <img src={c.img} alt={c.name ?? "Coctel de autor"} loading="lazy"
                  className="w-full aspect-square object-cover object-top transition-transform duration-[2s] group-hover:scale-110"
                  style={{ transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)" }} />
                {c.name && (
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="font-accent italic text-[22px] md:text-[28px]">{c.name}</span>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-20 md:mt-32 w-[92%] md:w-[60%] mx-auto border border-[#B08A5B]/40 px-6 md:px-14 py-12 text-center">
        <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B]">Todos los días · 3:00 – 7:00 p.m.</p>
        <h3 className="font-accent text-[38px] md:text-[56px] leading-none mt-5">Tardes en Insurgentes</h3>
        <p className="font-body font-light text-[15px] leading-7 text-[#EDE5D6]/65 mt-5 max-w-[520px] mx-auto">
          Margarita o copa de espumante, con una boca de cortesía a elegir: ostras, croquetas, atún o tacos.
        </p>
        <a href={INFO.whatsapp} target="_blank" rel="noreferrer"
          className="inline-block mt-8 px-8 py-3 border border-[#EDE5D6]/30 font-manrope text-sm tracking-wide hover:bg-[#EF5C32] hover:border-[#EF5C32] transition-colors duration-300">
          Reservá tu tarde
        </a>
      </div>
    </section>
  );
}
