import { CalendarDays, Instagram, MessageCircle } from "lucide-react";
import { IG } from "../data";

const items = [
  { icon: CalendarDays, label: "Reservar", href: "#contacto" },
  { icon: Instagram, label: "Instagram", href: IG },
  { icon: MessageCircle, label: "Escríbenos", href: IG },
];

export default function FloatingNav() {
  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 items-end">
      {items.map(({ icon: Icon, label, href }) => (
        <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
          className="group h-12 min-w-12 px-3.5 rounded-full bg-black text-white flex items-center hover:bg-[#F0603A] transition-colors duration-300 shadow-lg">
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] group-hover:max-w-[160px] group-hover:mr-2 transition-all duration-300">{label}</span>
          <Icon className="w-5 h-5 shrink-0" />
        </a>
      ))}
    </div>
  );
}
