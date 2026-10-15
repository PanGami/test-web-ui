/**
 * App.tsx — Root component.
 * Imports styles and assembles all section components.
 * Calls ScrollTrigger.refresh() once fonts are loaded so measurements
 * are accurate (GSAP timing depends on layout being stable).
 */

import { useEffect } from "react";
import { ScrollTrigger } from "./animations/registerGsap";

// Global styles
import "./styles/tokens.css";
import "./styles/base.css";

// Components — will be built in Stage 2+
// Importing stubs for now so the app compiles cleanly
import Nav from "./components/Nav";
import Preloader from "./components/Preloader";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  // Refresh ScrollTrigger after fonts load so element heights are final
  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return (
    <>
      {/* Skip to main content — first focusable element for keyboard users */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Preloader />
      <Nav />

      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
