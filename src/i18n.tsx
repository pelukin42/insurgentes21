import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";
/** A translatable string: [español, English]. Plain strings are shown as-is in both languages. */
export type T = string | readonly [string, string];

const KEY = "i21-lang";
const initial = (): Lang => {
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "es" || q === "en") return q;
    const s = localStorage.getItem(KEY);
    if (s === "es" || s === "en") return s;
  } catch { /* storage blocked */ }
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "es", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  const t = (s: T) => (typeof s === "string" ? s : s[lang === "es" ? 0 : 1]);
  return { lang, setLang, t };
}
