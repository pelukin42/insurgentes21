import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flame, Martini, Wine, Crown } from "lucide-react";
import { useSplitChars } from "../useSplitChars";

const cards = [
  { icon: Flame, label: "Brasa viva al Josper", sub: "Cortes USDA Prime y Choice" },
  { icon: Martini, label: "Mixología de autor", sub: "Barra frente al bartender" },
  { icon: Wine, label: "La cava", sub: "Más de 70 etiquetas" },
  { icon: Crown, label: "Salón VIP", sub: "Para más de 14 invitados" },
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
          {cards.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="x-card bg-black/85 backdrop-blur-sm border border-white/5 px-4 md:px-6 py-6 md:py-8 flex flex-col items-center text-center gap-3 md:gap-4">
              <Icon className="x-icon w-10 h-10 md:w-12 md:h-12 text-[#EF5C32]" strokeWidth={1.2} />
              <span className="text-primary font-accent text-[20px] md:text-[24px] leading-tight">{label}</span>
              <span className="font-body text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#B08A5B]">{sub}</span>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 px-6 text-center">
          <p className="font-body text-[11px] tracking-[0.3em] uppercase text-white/70"><span className="font-accent text-[28px] normal-case tracking-normal text-white mr-2">4,7 ★</span>OpenTable · 147 reseñas</p>
          <p className="font-body text-[11px] tracking-[0.3em] uppercase text-white/70 self-center">Terraza · Chef's table · Parqueo privado</p>
        </div>
      </div>
    </section>
  );
}
