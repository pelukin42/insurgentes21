import { Instagram } from "lucide-react";
import { IG } from "../data";
import { Logo } from "./Logo";

const L = "text-[15px] text-black font-medium hover:text-[#F0603A] transition-colors";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-white text-black">
      <div className="px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-10 md:pb-16 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-4">
          <Logo className="h-16" />
          <p className="font-accent text-4xl">Reserva tu mesa</p>
          <p className="text-[13px] text-black/40 uppercase tracking-wider">Reservaciones por mensaje directo</p>
          <a href={IG} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[14px] font-bold hover:text-[#F0603A]">
            <Instagram className="w-4 h-4" /> @insurgentes_21
          </a>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="text-[12px] uppercase tracking-wider text-black/40 mb-4">Navegar</p>
            <ul className="space-y-2">
              {[["Nosotros", "#nosotros"], ["Menú", "#menu"], ["Experiencia", "#experiencia"], ["Contacto", "#contacto"]].map(([t, h]) => (
                <li key={t}><a href={h} className={L}>{t}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-wider text-black/40 mb-4">Social</p>
            <ul className="space-y-2"><li><a href={IG} target="_blank" rel="noreferrer" className={L}>Instagram</a></li></ul>
          </div>
        </div>
      </div>
      <div className="bg-black px-6 md:px-10 lg:px-16 py-4 flex flex-col md:flex-row justify-between gap-2">
        <p className="text-[12px] text-white/40">© {new Date().getFullYear()} Insurgentes 21. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="text-[12px] text-white/40 hover:text-white">Aviso de privacidad</a>
          <a href="#" className="text-[12px] text-white/40 hover:text-white">Términos</a>
        </div>
      </div>
    </footer>
  );
}
