import { CalendarDays, Instagram, MessageCircle } from "lucide-react";
import { INFO } from "../data";
import { useLang } from "../i18n";

const items = [
  { icon: CalendarDays, label: ["Reservá tu mesa", "Book a table"] as const, href: INFO.opentable },
  { icon: MessageCircle, label: "WhatsApp", href: INFO.whatsapp },
  { icon: Instagram, label: "Instagram", href: INFO.instagram },
];

export default function FloatingNav() {
  const { t } = useLang();
  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 items-end">
      {items.map(({ icon: Icon, label, href }) => (
        <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={t(label)}
          className="group h-12 min-w-12 px-3.5 rounded-full bg-black/80 backdrop-blur border border-white/15 text-white flex items-center hover:bg-[#EF5C32] hover:border-[#EF5C32] transition-colors duration-300 shadow-lg">
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] group-hover:max-w-[160px] group-hover:mr-2 transition-all duration-300">{t(label)}</span>
          <Icon className="w-5 h-5 shrink-0" />
        </a>
      ))}
    </div>
  );
}
