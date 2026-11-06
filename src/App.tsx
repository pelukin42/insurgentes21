import { useEffect } from "react";
import { observeSections } from "./analytics";
import Navbar from "./components/Navbar";
import FloatingNav from "./components/FloatingNav";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import About from "./components/About";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Carta from "./components/Carta";
import Cocteleria from "./components/Cocteleria";
import WineBand from "./components/WineBand";
import Visit from "./components/Visit";
import Eventos from "./components/Eventos";
import FullMenu from "./components/FullMenu";
import Resenas from "./components/Resenas";

export default function App() {
  useEffect(observeSections, []);
  return (
    <main>
      <Navbar /><FloatingNav /><Hero /><Gallery /><About /><Carta /><Cocteleria /><WineBand /><Eventos /><Experience /><Resenas /><Visit /><Footer /><FullMenu />
      <div className="grain" aria-hidden />
    </main>
  );
}
