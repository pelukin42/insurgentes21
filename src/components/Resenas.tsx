import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Star } from "lucide-react";
import { INFO, ratings, reviews } from "../data";
import { useSplitChars } from "../useSplitChars";
import { useLang } from "../i18n";

const Stars = ({ n }: { n: number }) => (
  <span className="inline-flex gap-0.5 text-[#EF5C32]" aria-label={`${n}/5`}>
    {Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-4 h-4" fill={i < n ? "currentColor" : "none"} strokeWidth={1.4} />)}
  </span>
);

/** Reviews: rating badges, real guest quotes (when provided) and a strong "review us on Google" call. */
export default function Resenas() {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const { t, lang } = useLang();
  useSplitChars(title, { scroll: true });
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".r-in").forEach((el, i) =>
      gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: (i % 3) * 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
  }, { scope: ref });

  return (
    <section id="resenas" ref={ref} className="bg-[#EDE5D6] text-black py-24 md:py-36 overflow-hidden">
      <div className="text-center px-6">
        <p className="font-body text-[11px] tracking-[0.35em] uppercase text-[#B08A5B] mb-6">{t(["Reseñas", "Reviews"])}</p>
        <h2 key={lang} ref={title} className="invisible font-accent text-[44px] md:text-[6vw] leading-[0.95] tracking-[-0.03em]">{t(["Lo que dice la mesa", "What our guests say"])}</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {ratings.map((r) => (
            <a key={r.source} href={r.href} target="_blank" rel="noreferrer" className="r-in flex items-center gap-4 px-6 py-4 border border-black/15 hover:border-[#EF5C32] transition-colors">
              <span className="font-accent text-[40px] leading-none">{r.score}</span>
              <span className="text-left">
                <Stars n={5} />
                <span className="block text-[11px] tracking-[0.2em] uppercase text-black/50 mt-1">{r.source} · {t(r.count)}</span>
              </span>
            </a>
          ))}
          <a href={INFO.googleReviews} target="_blank" rel="noreferrer" className="r-in flex items-center gap-3 px-6 py-4 border border-black/15 hover:border-[#EF5C32] transition-colors text-[13px] tracking-wide">
            {t(["Ver reseñas en Google", "Read our Google reviews"])} <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-16 flex gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-[12vw] pb-4 [scrollbar-width:thin]">
          {reviews.map((r) => (
            <figure key={r.author + r.quote.slice(0, 20)} className="r-in snap-start shrink-0 w-[82vw] md:w-[30vw] bg-white/50 border border-black/10 p-7 md:p-9 flex flex-col">
              <Stars n={r.stars} />
              <blockquote className="font-accent text-[22px] md:text-[26px] leading-snug mt-5 flex-1">“{r.quote}”</blockquote>
              <figcaption className="mt-6 text-[11px] tracking-[0.25em] uppercase text-black/50">{r.author} · {r.source}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="r-in mt-16 mx-auto w-[92%] md:w-[60%] bg-black text-[#EDE5D6] px-7 md:px-14 py-12 text-center">
        <h3 className="font-accent text-[34px] md:text-[48px] leading-none">{t(["¿Cómo estuvo tu visita?", "How was your visit?"])}</h3>
        <p className="font-body font-light text-[15px] leading-7 text-[#EDE5D6]/70 mt-5 max-w-[520px] mx-auto">
          {t(["Tu reseña en Google nos ayuda a que más gente descubra Insurgentes 21. Toma menos de un minuto.",
            "A Google review helps more people discover Insurgentes 21. It takes less than a minute."])}
        </p>
        <a href={INFO.googleReview} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-3 mt-8 px-8 py-4 bg-[#EF5C32] text-white font-manrope text-sm tracking-wide hover:bg-[#d84a22] transition-colors">
          <Star className="w-4 h-4" fill="currentColor" /> {t(["Dejá tu reseña en Google", "Review us on Google"])}
        </a>
      </div>
    </section>
  );
}
