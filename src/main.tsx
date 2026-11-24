import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LangProvider } from "./i18n";
import { initAnalytics } from "./analytics";
import { initSofia } from "./sofia";
import "./index.css";
initAnalytics();
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><LangProvider><App /></LangProvider></React.StrictMode>);
// Después de cargar la página: no compite con el video de apertura y ya se sabe el idioma.
if (document.readyState === "complete") initSofia();
else window.addEventListener("load", initSofia, { once: true });
