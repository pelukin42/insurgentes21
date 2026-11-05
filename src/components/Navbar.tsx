import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { menu } from "../data";

type Item = { label: string; href: string; items: string[] };

const Dropdown = ({ item }: { item: Item }) => (
  <div className="relative group">
    <a href={item.href} className="flex items-center gap-1 text-[14px] text-white hover:text-[#F0603A] transition-colors py-2">
      {item.label} <ChevronDown className="w-3.5 h-3.5" />
    </a>
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
      <ul className="bg-white shadow-lg py-2 min-w-[220px]">
        {item.items.map((s) => (
          <li key={s}><a href={item.href} className="block px-4 py-2.5 text-[13px] text-black hover:bg-[#F0603A] hover:text-white">{s}</a></li>
        ))}
      </ul>
    </div>
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const [lang, setLang] = useState<"ES" | "EN">("ES");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 50);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-20 flex items-center px-4 md:px-10 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-[80px] shadow-md py-2" : "bg-transparent py-4"}`}>
        <div className="flex-1 hidden lg:flex items-center gap-2 text-white text-[13px]">
          <MapPin className="w-4 h-4" /> Insurgentes 21
        </div>
        <button className="lg:hidden text-white" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button>
        <div className="flex-1 lg:flex-none flex items-center justify-center gap-10">
          <div className="hidden lg:flex gap-8">{menu.left.map((m) => <Dropdown key={m.label} item={m} />)}</div>
          <a href="#top"><Logo className={`transition-all ${scrolled ? "h-[32px] md:h-[40px]" : "h-[40px] md:h-[56px]"}`} /></a>
          <div className="hidden lg:flex gap-8">{menu.right.map((m) => <Dropdown key={m.label} item={m} />)}</div>
        </div>
        <div className="flex-1 flex justify-end gap-1">
          {(["ES", "EN"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 text-[12px] ${lang === l ? "bg-[#F0603A] text-white" : "text-white hover:text-[#F0603A]"}`}>{l}</button>
          ))}
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <Logo className="h-10" />
            <button onClick={() => setOpen(false)} className="text-white" aria-label="Cerrar"><X /></button>
          </div>
          {[...menu.left, ...menu.right].map((m) => (
            <div key={m.label} className="border-b border-white/10">
              <button className="w-full flex justify-between py-4 text-white font-accent text-2xl" onClick={() => setAcc(acc === m.label ? null : m.label)}>
                {m.label} <ChevronDown className={`transition-transform ${acc === m.label ? "rotate-180" : ""}`} />
              </button>
              {acc === m.label && (
                <ul className="pb-4">{m.items.map((s) => (
                  <li key={s}><a href={m.href} onClick={() => setOpen(false)} className="block py-2 text-white/70 hover:text-[#F0603A]">{s}</a></li>
                ))}</ul>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
