import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { useLang } from "./i18n";
gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

/** Per-char reveal: {opacity:0,y:40} -> {opacity:1,y:0}, 0.8s, 30ms stagger, power3.out */
export function useSplitChars(
  ref: RefObject<HTMLElement>,
  opts: { charsClass?: string; delay?: number; scroll?: boolean; onComplete?: () => void; enabled?: boolean } = {},
) {
  const { lang } = useLang(); // headings are re-keyed by language, so split again
  useGSAP(() => {
    if (!ref.current || opts.enabled === false) return;
    gsap.set(ref.current, { visibility: "visible" });
    const split = SplitText.create(ref.current, { type: "chars", smartWrap: true, charsClass: opts.charsClass ?? "split-char font-accent" });
    gsap.fromTo(split.chars, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.03, delay: opts.delay ?? 0,
      onComplete: opts.onComplete,
      scrollTrigger: opts.scroll ? { trigger: ref.current, start: "top 85%", once: true } : undefined,
    });
    return () => split.revert();
  }, { dependencies: [opts.enabled, lang], scope: ref });
}
