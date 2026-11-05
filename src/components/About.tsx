import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { marqueeWords } from "../data";

const TEXT = "En Insurgentes 21 celebramos la mesa compartida: cocina de temporada con raíz mexicana, coctelería de autor y una cava pensada para acompañar cada plato, en un espacio donde la noche se vive sin prisa.";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current, { rotate: 3 }, { rotate: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true } });
    gsap.fromTo(".w", { opacity: 0.1, filter: "blur(4px)" }, {
      opacity: 1, filter: "blur(0px)", stagger: 0.05, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom-=20%", end: "bottom bottom", scrub: true },
    });
  }, { scope: ref });

  return (
    <section id="nosotros" className="bg-white py-16 md:py-32 flex flex-col items-center justify-center px-6 md:px-[18%] overflow-hidden">
      <h2 className="font-luxurious text-[40px] text-center text-black mb-[20px]">Nosotros</h2>
      <div ref={ref}>
        <p className="font-accent uppercase text-[24px] leading-[36px] md:text-[40px] md:leading-[56px] text-center text-black">
          {TEXT.split(" ").map((w, i) => <span key={i} className="w inline-block mr-[0.25em]">{w}</span>)}
        </p>
      </div>
      <a href="#experiencia" className="mt-10 px-8 py-3 bg-black text-white font-manrope text-sm tracking-wide hover:bg-[#F0603A] transition-colors duration-300">Conoce más</a>

      <div className="group relative w-full mt-16 md:mt-[140px] overflow-hidden">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="font-body text-[14px] tracking-[0.2em] uppercase text-black/40 whitespace-nowrap mr-12">{w}</span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
