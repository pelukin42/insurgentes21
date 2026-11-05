import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { carta } from "../data";
import { useSplitChars } from "../useSplitChars";

/** Pinned horizontal scroll of signature dishes (desktop); swipeable row on mobile. */
export default function Carta() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useSplitChars(title, { scroll: true });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const el = track.current!;
      const dist = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      });
      gsap.utils.toArray<HTMLElement>(".c-img").forEach((img) =>
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none",
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }));
    });
    return () => mm.revert();
  }, { scope: section });

  return (
    <section id="carta" ref={section} className="relative bg-[#14170F] text-[#EDE5D6] overflow-hidden md:h-screen flex items-center py-20 md:py-0">
      <div ref={track} className="flex items-center gap-6 md:gap-12 pl-6 md:pl-[8vw] pr-6 md:pr-[12vw] overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-pl-6 md:snap-none w-full md:w-max [scrollbar-width:none]">
        <div className="shrink-0 w-[78vw] md:w-[34vw] snap-start pr-4">
          <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-6">La Carta</p>
          <h2 ref={title} className="invisible font-accent text-[44px] md:text-[5.5vw] leading-[0.95] tracking-[-0.03em]">Del Josper a tu mesa</h2>
          <p className="mt-8 font-body font-light text-[15px] leading-7 text-[#EDE5D6]/60 max-w-[420px]">
            Brasa viva, producto premium y raíz mexicana. Una selección de los favoritos de nuestra mesa.
          </p>
          <div className="mt-10 hidden md:flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-[#EDE5D6]/40">
            <span className="h-px w-16 bg-[#EDE5D6]/30" /> Desliza
          </div>
        </div>
        {carta.map((d, i) => (
          <article key={d.name} className={`shrink-0 w-[72vw] md:w-[26vw] snap-start ${i % 2 ? "md:mt-[14vh]" : "md:-mt-[10vh]"}`}>
            <div className="relative aspect-square overflow-hidden">
              <img src={d.img} alt={d.name} loading="lazy" className="c-img absolute inset-0 w-[116%] max-w-none h-full -left-[8%] object-cover object-top" />
            </div>
            <div className="mt-5 flex items-baseline gap-4 border-t border-[#EDE5D6]/15 pt-4">
              <span className="font-accent italic text-[#EF5C32] text-lg">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-accent text-[26px] md:text-[2vw] leading-tight">{d.name}</h3>
                <p className="font-body text-[11px] tracking-[0.3em] uppercase text-[#B08A5B] mt-1">{d.note}</p>
                <p className="font-body font-light text-[14px] leading-6 text-[#EDE5D6]/60 mt-3 max-w-[360px]">{d.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
