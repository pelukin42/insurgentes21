/**
 * Google Analytics 4. Set the measurement ID (G-XXXXXXX) as VITE_GA_ID
 * (GitHub: Settings → Secrets and variables → Actions → Variables → GA_ID).
 * Without it nothing is loaded or sent; in dev, events are logged to the console.
 *
 * Every click on a tracked link is reported automatically (see `classify`), with
 * `area` = the section it was clicked in, so GA shows e.g. "whatsapp from eventos".
 */
type Gtag = (...args: unknown[]) => void;
declare global { interface Window { dataLayer?: unknown[]; gtag?: Gtag } }

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export function track(event: string, params: Record<string, string | number> = {}) {
  if (import.meta.env.DEV) console.debug("[track]", event, params);
  window.gtag?.("event", event, params);
}

/** Link → event name. Order matters (first match wins). */
const classify = (href: string): string | null => {
  if (href.includes("opentable.")) return "reserva_opentable";
  if (href.includes("wa.me/")) return href.includes("text=") ? "cotizar_evento" : "whatsapp";
  if (href.startsWith("tel:")) return "llamada";
  if (href.endsWith(".pdf")) return "menu_pdf";
  if (href.includes("writereview") || href.endsWith("/resena/")) return "resena_google";
  if (href.includes("local/reviews")) return "ver_resenas_google";
  if (href.includes("#carta-completa")) return "carta_completa";
  if (href.includes("instagram.com")) return "instagram";
  if (href.includes("maps.") || href.includes("google.com/maps") || href.includes("waze.com")) return "como_llegar";
  return null;
};

const areaOf = (el: Element) =>
  el.closest<HTMLElement>("[data-area]")?.dataset.area ??
  el.closest("section[id], footer[id]")?.id ?? (el.closest("nav") ? "navbar" : "otro");

export function initAnalytics() {
  if (GA_ID) {
    const s = document.createElement("script");
    s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); } as Gtag;
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const ev = classify(a.getAttribute("href") ?? "");
    if (ev) track(ev, { area: areaOf(a), link_text: (a.textContent ?? "").trim().slice(0, 60) });
  }, { capture: true });

}

/** How far people get: one event per section, once it sits in the middle of the screen for 1 s. Call after render. */
export function observeSections() {
  const timers = new Map<Element, number>();
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    clearTimeout(timers.get(en.target));
    if (!en.isIntersecting) return;
    timers.set(en.target, window.setTimeout(() => {
      track("seccion_vista", { seccion: (en.target as HTMLElement).id });
      io.unobserve(en.target);
    }, 1000));
  }), { rootMargin: "-50% 0px -50% 0px" });
  document.querySelectorAll("section[id], footer[id]").forEach((el) => io.observe(el));
  return () => { io.disconnect(); timers.forEach((t) => clearTimeout(t)); };
}
