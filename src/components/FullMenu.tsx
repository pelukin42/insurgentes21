import { useEffect, useState } from "react";
import { FileDown, X } from "lucide-react";
import { fullMenu } from "../menuData";
import { INFO } from "../data";
import { useLang } from "../i18n";

const HASH = "#carta-completa";

/** Full menu with prices. Opens on #carta-completa, so any link can open it. */
export default function FullMenu() {
  const [open, setOpen] = useState(false);
  const [sec, setSec] = useState(fullMenu[0].id);
  const { t, lang } = useLang();

  useEffect(() => {
    const sync = () => setOpen(location.hash === HASH);
    sync(); window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const close = () => {
    history.replaceState(null, "", location.pathname + location.search);
    setOpen(false);
  };
  if (!open) return null;
  const go = (id: string) => { setSec(id); document.getElementById(`m-${id}`)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div role="dialog" aria-modal="true" aria-label={t(["Carta completa", "Full menu"])} className="fixed inset-0 z-[80] bg-[#EDE5D6] text-black flex flex-col">
      <header className="flex items-center justify-between gap-4 px-5 md:px-10 py-4 border-b border-black/10">
        <p className="font-accent text-[24px] md:text-[32px]">{t(["La carta", "The menu"])}</p>
        <div className="flex items-center gap-3">
          <a href={INFO.menuPdf} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-[13px] hover:bg-[#EF5C32]">
            <FileDown className="w-4 h-4" /> PDF
          </a>
          <button onClick={close} aria-label={t(["Cerrar", "Close"])} className="p-2 hover:text-[#EF5C32]"><X /></button>
        </div>
      </header>
      <nav className="flex gap-2 overflow-x-auto px-5 md:px-10 py-3 border-b border-black/10 [scrollbar-width:none]">
        {fullMenu.map((s) => (
          <button key={s.id} onClick={() => go(s.id)}
            className={`shrink-0 px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase ${sec === s.id ? "bg-[#EF5C32] text-white" : "border border-black/15 hover:border-[#EF5C32]"}`}>
            {t(s.title)}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto px-5 md:px-10 pb-16">
        <div className="max-w-[860px] mx-auto">
          {lang === "en" && <p className="mt-6 text-[13px] text-black/50 italic">Dish descriptions are shown in Spanish, as on our printed menu. Our team will gladly explain any dish.</p>}
          <p className="mt-6 text-[12px] tracking-[0.2em] uppercase text-black/50">
            {t(["Precios en colones · impuesto (13 %) y servicio (10 %) incluidos", "Prices in colones · 13 % tax and 10 % service included"])}
          </p>
          {fullMenu.map((s) => (
            <section key={s.id} id={`m-${s.id}`} className="pt-10 scroll-mt-4">
              <h2 className="font-accent text-[34px] md:text-[44px] leading-none border-b border-black/15 pb-3">{t(s.title)}</h2>
              {s.notes.map((n) => <p key={n} className="mt-3 text-[14px] text-black/60">{n}</p>)}
              <ul className="mt-4">
                {s.items.map((it, i) => it.h ? (
                  <li key={i} className="mt-4 mb-1 pl-4 text-[11px] tracking-[0.25em] uppercase text-[#B08A5B]">{it.h}</li>
                ) : (
                  <li key={i} className={`py-2.5 ${it.sub ? "pl-4 py-1.5" : ""}`}>
                    <div className="flex items-baseline gap-3">
                      <span className={it.sub ? "text-[14px]" : "font-semibold text-[16px]"}>{it.n}</span>
                      {it.x && <span className="text-[11px] uppercase tracking-wider text-black/40">{it.x}</span>}
                      <span className="flex-1 border-b border-dotted border-black/20 translate-y-[-4px]" />
                      {it.p && <span className={`tabular-nums ${it.sub ? "text-[14px]" : "font-semibold"}`}>{it.p}</span>}
                    </div>
                    {it.d && <p className="text-[14px] leading-6 text-black/60 mt-1 max-w-[620px]">{it.d}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="mt-12 text-[12px] text-black/40">{t(["Precios sujetos a cambio.", "Prices subject to change."])}</p>
        </div>
      </div>
    </div>
  );
}
