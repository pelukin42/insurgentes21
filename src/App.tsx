import Navbar from "./components/Navbar";
import FloatingNav from "./components/FloatingNav";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import About from "./components/About";
import Experience from "./components/Experience";
import Footer from "./components/Footer";

export default function App() {
  return (
    <main>
      <Navbar /><FloatingNav /><Hero /><Gallery /><About /><Experience /><Footer />
    </main>
  );
}
