import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { marqueeWords } from "../data";
import { useLang } from "../i18n";

const TEXT_ES = "Llevamos la cocina mexicana a una experiencia gourmet: fuego vivo en nuestro Josper, cortes certificados USDA, mariscos frescos, mixología de autor y más de setenta etiquetas de vino. Una mesa para compartir, y para quedarse un poco más.";
const TEXT_EN = "We take Mexican cooking to a gourmet experience: live fire in our Josper, USDA-certified cuts, fresh seafood, signature mixology and more than seventy wine labels. A table to share, and to stay a little longer.";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();
  useGSAP(() => {
    gsap.fromTo(ref.current, { rotate: 3 }, { rotate: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true } });
    gsap.fromTo(".w", { opacity: 0.1, filter: "blur(4px)" }, {
      opacity: 1, filter: "blur(0px)", stagger: 0.05, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom-=20%", end: "bottom bottom", scrub: true },
    });
  }, { scope: ref, dependencies: [lang], revertOnUpdate: true });

  return (
    <section id="nosotros" className="bg-[#EDE5D6] py-16 md:py-32 flex flex-col items-center justify-center px-6 md:px-[18%] overflow-hidden">
      <h2 className="font-luxurious text-[40px] text-center text-black mb-[20px]">{t(["Nuestra cocina", "Our kitchen"])}</h2>
      <div ref={ref}>
        <p className="font-accent uppercase text-[24px] leading-[36px] md:text-[40px] md:leading-[56px] text-center text-black">
          {(lang === "es" ? TEXT_ES : TEXT_EN).split(" ").map((w, i) => <span key={lang + i} className="w inline-block mr-[0.25em]">{w}</span>)}
        </p>
      </div>
      <a href="#carta" className="mt-10 px-8 py-3 bg-black text-white font-manrope text-sm tracking-wide hover:bg-[#EF5C32] transition-colors duration-300">{t(["Descubrí la carta", "Discover the menu"])}</a>

      <div className="group relative w-full mt-16 md:mt-[140px] overflow-hidden">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="font-body text-[14px] tracking-[0.2em] uppercase text-black/40 whitespace-nowrap mr-12">{t(w)}</span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#EDE5D6] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#EDE5D6] to-transparent" />
      </div>
    </section>
  );
}
