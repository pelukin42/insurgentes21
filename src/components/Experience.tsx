import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { UtensilsCrossed, Martini, Wine, Sparkles } from "lucide-react";
import { useSplitChars } from "../useSplitChars";

const cards = [
  { icon: UtensilsCrossed, label: "Cocina de temporada" },
  { icon: Martini, label: "Coctelería de autor" },
  { icon: Wine, label: "Cava seleccionada" },
  { icon: Sparkles, label: "Eventos privados" },
];

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useSplitChars(title, { scroll: true });
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".x-card").forEach((el, i) =>
      gsap.fromTo(el, { y: 80 }, { y: 0, duration: 0.7, ease: "power3.out", delay: i * 0.15, scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
    gsap.utils.toArray<SVGElement>(".x-icon").forEach((el, i) =>
      gsap.to(el, { y: -4, rotate: i % 2 ? 8 : -8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" }));
  }, { scope: ref });

  return (
    <section id="experiencia" ref={ref} className="relative min-h-[90vh] flex flex-col items-center justify-center py-24 overflow-hidden">
      <img src="/img/ambiente/ambiente-05_DWjnI2ljcjb.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 ref={title} className="invisible font-accent uppercase text-[28px] md:text-[48px] leading-[1.4] text-primary text-center px-4 mb-10">La experiencia</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-[8px] w-[90%] md:w-[64%]">
          {cards.map(({ icon: Icon, label }) => (
            <div key={label} className="x-card bg-black px-4 md:px-6 py-6 md:py-8 flex flex-col items-center text-center gap-3 md:gap-4">
              <Icon className="x-icon w-10 h-10 md:w-12 md:h-12 text-[#F0603A]" strokeWidth={1.2} />
              <span className="text-primary font-body text-[12px] md:text-[14px] tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
