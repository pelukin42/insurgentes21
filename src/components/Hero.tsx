import { useEffect, useRef, useState } from "react";
import { heroSlides } from "../data";
import { useSplitChars } from "../useSplitChars";
import { useLang } from "../i18n";

const SCROLL_PER_SLIDE_VH = 150;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const clip = (p: number) => `ellipse(${5 + p * 150}% ${8 + p * 150}% at 50% 50%)`;

export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const h1 = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const [h1Done, setH1Done] = useState(false);
  const { t, lang } = useLang();

  useSplitChars(h1, { delay: 0.2, onComplete: () => setH1Done(true) });
  useSplitChars(sub, { enabled: h1Done, charsClass: "split-char font-luxurious" });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (!wrap.current) return;
      const scrolled = -wrap.current.getBoundingClientRect().top;
      const per = (window.innerHeight * SCROLL_PER_SLIDE_VH) / 100;
      slides.current.forEach((el, i) => {
        if (!el || i === 0) return;
        const local = Math.min(1, Math.max(0, (scrolled - (i - 1) * per) / per));
        const p = ease(local);
        el.style.clipPath = clip(p);
        el.style.visibility = local <= 0 ? "hidden" : "visible";
      });
      // play only what can be seen: a slide is visible once revealed and until the next one fully covers it
      slides.current.forEach((el, i) => {
        const vid = el?.querySelector("video");
        if (!vid) return;
        const revealed = i === 0 || scrolled > (i - 1) * per;
        const covered = i < slides.current.length - 1 && scrolled >= i * per + per;
        const show = revealed && !covered && scrolled < window.innerHeight + (slides.current.length - 1) * per;
        if (show && vid.paused) vid.play().catch(() => {});
        else if (!show && !vid.paused) vid.pause();
      });
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  return (
    <div id="top" ref={wrap} style={{ height: `calc(100vh + ${(heroSlides.length - 1) * SCROLL_PER_SLIDE_VH}vh)` }}>
      <section className="sticky top-0 w-full h-screen overflow-hidden">
        {heroSlides.map((s, i) => (
          <div key={s.video} ref={(el) => (slides.current[i] = el)} className="absolute inset-0"
            style={{ zIndex: i, clipPath: i === 0 ? undefined : clip(0), visibility: i === 0 ? "visible" : "hidden" }}>
            <video className="w-full h-full object-cover" src={s.video} poster={s.poster}
              autoPlay={i === 0} loop muted playsInline preload={i === 0 ? "auto" : "metadata"} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />
          </div>
        ))}

        <p key={lang} ref={sub} className="invisible absolute inset-x-0 top-0 z-10 text-center font-luxurious text-[12vw] md:text-[3.4vw] text-white"
          style={{ paddingTop: "calc(80px + 60px)" }}>
          {t(["cocina mexicana, a otro nivel", "Mexican cuisine, elevated"])}
        </p>
        <h1 ref={h1} className="invisible absolute z-10 inset-x-0 px-4 md:px-0 bottom-[48px] md:bottom-[-2vw] font-accent text-white text-[56px] leading-[1.05] whitespace-normal text-center md:text-[15vw] md:leading-[1] md:whitespace-nowrap tracking-[-0.04em]">
          INSURGENTES<sup className="text-[#EF5C32] text-[0.32em] align-[1.6em] ml-[0.05em] tracking-normal">21</sup>
        </h1>
      </section>
    </div>
  );
}
