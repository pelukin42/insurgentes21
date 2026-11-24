/**
 * Chat de Sofía (la asistente del CRM de Insurgentes 21) en la página.
 *
 * Carga `widget.js` del CRM con la llave pública del canal "Chat en tu web"
 * (CRM → Canales → Chat en tu web → código). Sin `VITE_SOFIA_API_KEY` no se
 * carga nada: el sitio funciona igual, sin burbuja.
 *
 *   VITE_SOFIA_API_KEY   llave del canal (pública por diseño: va en el HTML)
 *   VITE_SOFIA_CRM_URL   dirección del CRM; por defecto la temporal. Cuando el
 *                        CRM pase a crm.insurgentes21.com basta con cambiarla.
 *
 * En el CRM conviene limitar el canal a los dominios del sitio (lista de
 * dominios del canal) para que nadie copie la llave en otra página.
 */
import { track } from "./analytics";

const API_KEY = (import.meta.env.VITE_SOFIA_API_KEY as string | undefined)?.trim();
const CRM = ((import.meta.env.VITE_SOFIA_CRM_URL as string | undefined) || "https://crm-insurgentes.axelsites.com").replace(/\/+$/, "");

const TEXTOS = {
  es: {
    titulo: "Sofía · Insurgentes 21",
    subtitulo: "Reservas, carta y eventos · responde al instante",
    saludo: "¡Hola! Soy Sofía, de Insurgentes 21. ¿Te ayudo a reservar una mesa, ver la carta o cotizar un evento?",
    escribiendo: "Sofía está escribiendo…",
  },
  en: {
    titulo: "Sofía · Insurgentes 21",
    subtitulo: "Bookings, menu and events · instant replies",
    saludo: "Hi! I'm Sofía from Insurgentes 21. Can I help you book a table, check the menu or plan an event?",
    escribiendo: "Sofía is typing…",
  },
};

function idioma(): "es" | "en" {
  const l = document.documentElement.lang || navigator.language || "es";
  return l.toLowerCase().startsWith("es") ? "es" : "en";
}

export function initSofia() {
  if (!API_KEY || document.getElementById("cbw-chat-root")) return;
  const t = TEXTOS[idioma()];
  const s = document.createElement("script");
  s.src = `${CRM}/widget.js`;
  s.async = true;
  s.setAttribute("data-api-key", API_KEY);
  s.setAttribute("data-api-base", CRM);
  s.setAttribute("data-brand", "#EF5C32");
  s.setAttribute("data-title", t.titulo);
  s.setAttribute("data-subtitle", t.subtitulo);
  s.setAttribute("data-greeting", t.saludo);
  s.setAttribute("data-typing-text", t.escribiendo);
  document.body.appendChild(s);

  // Cuántas personas abren el chat (lo ve Gerencia en "Página web").
  document.addEventListener(
    "click",
    (e) => {
      const fab = (e.target as Element | null)?.closest?.("#cbw-fab");
      const panel = document.getElementById("cbw-panel");
      if (fab && !panel?.classList.contains("open")) track("chat_abierto", { idioma: idioma() });
    },
    true,
  );
}
