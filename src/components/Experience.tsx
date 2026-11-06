import { asset } from "../asset";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flame, Martini, Wine, Crown } from "lucide-react";
import { useSplitChars } from "../useSplitChars";
import { useLang } from "../i18n";

const cards = [
  { icon: Flame, label: ["Brasa viva al Josper", "Josper live fire"], sub: ["Cortes USDA Prime y Choice", "USDA Prime & Choice cuts"] },
  { icon: Martini, label: ["Mixología de autor", "Signature mixology"], sub: ["Barra frente al bartender", "Seats facing the bartender"] },
  { icon: Wine, label: ["La cava", "Wine cellar"], sub: ["Más de 70 etiquetas", "70+ labels"] },
  { icon: Crown, label: ["Salón VIP", "VIP room"], sub: ["Para más de 14 invitados", "For 14+ guests"] },
] as const;

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { t, lang } = useLang();
  useSplitChars(title, { scroll: true });
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".x-card").forEach((el, i) =>
      gsap.fromTo(el, { y: 80 }, { y: 0, duration: 0.7, ease: "power3.out", delay: i * 0.15, scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
    gsap.utils.toArray<SVGElement>(".x-icon").forEach((el, i) =>
      gsap.to(el, { y: -4, rotate: i % 2 ? 8 : -8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" }));
  }, { scope: ref });

  return (
    <section id="experiencia" ref={ref} className="relative min-h-[90vh] flex flex-col items-center justify-center py-24 overflow-hidden">
      <img src={asset("/img/ambiente/ambiente-05_DWjnI2ljcjb.jpg")} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 key={lang} ref={title} className="invisible font-accent uppercase text-[28px] md:text-[48px] leading-[1.4] text-primary text-center px-4 mb-10">{t(["La experiencia", "The experience"])}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-[8px] w-[90%] md:w-[64%]">
          {cards.map(({ icon: Icon, label, sub }) => (
            <div key={label[0]} className="x-card bg-black/85 backdrop-blur-sm border border-white/5 px-4 md:px-6 py-6 md:py-8 flex flex-col items-center text-center gap-3 md:gap-4">
              <Icon className="x-icon w-10 h-10 md:w-12 md:h-12 text-[#EF5C32]" strokeWidth={1.2} />
              <span className="text-primary font-accent text-[20px] md:text-[24px] leading-tight">{t(label)}</span>
              <span className="font-body text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#B08A5B]">{t(sub)}</span>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 px-6 text-center">
          <p className="font-body text-[11px] tracking-[0.3em] uppercase text-white/70"><span className="font-accent text-[28px] normal-case tracking-normal text-white mr-2">4,7 ★</span>{t(["OpenTable · 147 reseñas", "OpenTable · 147 reviews"])}</p>
          <p className="font-body text-[11px] tracking-[0.3em] uppercase text-white/70 self-center">{t(["Terraza · Chef's table · Parqueo privado", "Terrace · Chef's table · Private parking"])}</p>
        </div>
      </div>
    </section>
  );
}
