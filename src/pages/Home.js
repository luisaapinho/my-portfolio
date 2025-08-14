import Hero from '../components/hero/Hero';
import AboutMe from '../components/aboutme/AboutMe';
import ProjectGrid from '../components/ProjectGrid/ProjectGrid';
import ContactMeSection from '../components/ContactMe/ContactMeSection';


export default function Home() {
  return (
    <>
      <Hero />
      <AboutMe/>
     <img
        src="/assets/topo-projeto.png"
        alt="torn paper divider"
        className="projects-divider overlap-next"
      />
      <ProjectGrid/>
      <img
        src="/assets/topo-projeto.png"
        alt="torn paper divider"
        className="projects-divider flipped overlap-prev"
      />
      <ContactMeSection/>
    </>
  );
}