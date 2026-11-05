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

export default function App() {
  return (
    <main>
      <Navbar /><FloatingNav /><Hero /><Gallery /><About /><Carta /><Cocteleria /><WineBand /><Experience /><Visit /><Footer />
      <div className="grain" aria-hidden />
    </main>
  );
}
