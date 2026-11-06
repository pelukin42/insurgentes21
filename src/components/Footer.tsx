import { Instagram, MessageCircle, MapPin, FileDown } from "lucide-react";
import { INFO } from "../data";
import { Logo } from "./Logo";
import { useLang } from "../i18n";

const L = "text-[15px] text-black font-medium hover:text-[#EF5C32] transition-colors";
const ext = { target: "_blank", rel: "noreferrer" };

export default function Footer() {
  const { t } = useLang();
  return (
    <footer id="contacto" className="bg-[#EDE5D6] text-black border-t border-black/10">
      <div className="px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-10 md:pb-16 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-3">
          <Logo className="h-16 mb-4" />
          <p className="text-[13px] text-black/40 uppercase tracking-wider">{t(["Reservas", "Reservations"])} {INFO.phone}</p>
          <p className="text-[14px] font-bold">{INFO.address}</p>
          <p className="text-[13px] text-black/60">{INFO.city}</p>
        </div>
        <div className="flex gap-16">
          <div>
            <p className="text-[12px] uppercase tracking-wider text-black/40 mb-4">{t(["Navegar", "Explore"])}</p>
            <ul className="space-y-2">
              {([[["Nuestra cocina", "Our kitchen"], "#nosotros"], [["La carta", "The menu"], "#carta"], [["Mixología", "Mixology"], "#cocteleria"], [["Eventos", "Events"], "#eventos"], [["La experiencia", "The experience"], "#experiencia"], [["Visitanos", "Visit us"], "#visitanos"]] as const).map(([l, h]) => (
                <li key={h}><a href={h} className={L}>{t(l)}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-wider text-black/40 mb-4">Social</p>
            <ul className="space-y-2">
              <li><a href={INFO.instagram} {...ext} className={`${L} inline-flex items-center gap-2`}><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a href={INFO.menuPdf} {...ext} className={`${L} inline-flex items-center gap-2`}><FileDown className="w-4 h-4" /> {t(["Menú (PDF)", "Menu (PDF)"])}</a></li>
              <li><a href={INFO.whatsapp} {...ext} className={`${L} inline-flex items-center gap-2`}><MessageCircle className="w-4 h-4" /> WhatsApp</a></li>
              <li><a href={INFO.maps} {...ext} className={`${L} inline-flex items-center gap-2`}><MapPin className="w-4 h-4" /> {t(["Cómo llegar", "Directions"])}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#1A1D14] px-6 md:px-10 lg:px-16 py-4 flex flex-col md:flex-row justify-between gap-2">
        <p className="text-[12px] text-white/40">© {new Date().getFullYear()} Insurgentes 21 · Escazú, Costa Rica</p>
        <p className="text-[12px] text-white/40">{t(["Cocina mexicana contemporánea", "Contemporary Mexican cuisine"])}</p>
      </div>
    </footer>
  );
}
