// pages/Home.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from '../components/hero/Hero';
import AboutMe from '../components/aboutme/AboutMe';
import ProjectGrid from '../components/ProjectGrid/ProjectGrid';
import ContactMeSection from '../components/ContactMe/ContactMeSection';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    // 1) Restore saved scroll (coming back from a project CLOSE)
    const saved = sessionStorage.getItem("homeScrollY");
    if (saved !== null) {
      window.scrollTo(0, Number(saved));
      sessionStorage.removeItem("homeScrollY");
      return; // do not also run contact scroll
    }

    // 2) If navigation asked to scroll to contact specifically
    if (location.state?.scrollTo === "contact") {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      // clear state so reload/back doesn't re-trigger
      window.history.replaceState({}, document.title, "/");
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <AboutMe/>
      <img src="/assets/topo-projeto.png" alt="torn paper divider" className="projects-divider overlap-next" />
      <ProjectGrid/>
      <img src="/assets/topo-projeto.png" alt="torn paper divider" className="projects-divider flipped overlap-prev" />
      <section id="contact">
        <ContactMeSection/>
      </section>
    </>
  );
}
