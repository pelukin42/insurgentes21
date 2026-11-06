import { asset } from "../asset";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLang } from "../i18n";

/** Full-bleed parallax image with a quote. */
export default function WineBand() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useGSAP(() => {
    gsap.fromTo(".w-img", { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1.05, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".w-txt", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 60%", once: true } });
  }, { scope: ref });

  return (
    <section id="vinos" ref={ref} className="relative h-[80vh] md:h-[110vh] overflow-hidden flex items-center justify-center">
      <img src={asset("/img/vinos/vinos-01_DXNTA5WD_Tl.jpg")} alt="" className="w-img absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="w-txt relative z-10 text-center px-6 max-w-[900px]">
        <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-8">{t(["La Cava · Más de 70 etiquetas", "The Cellar · 70+ labels"])}</p>
        <blockquote className="font-accent text-[34px] md:text-[64px] leading-[1.05] text-[#EDE5D6]">
          {t(["“El fuego, la mesa y una copa bien servida.”", "“Fire, the table and a well-poured glass.”"])}
        </blockquote>
        <p className="font-luxurious text-[32px] md:text-[44px] text-[#EDE5D6]/70 mt-6">{t(["una cava de piso a techo", "a floor-to-ceiling cellar"])}</p>
      </div>
    </section>
  );
}
