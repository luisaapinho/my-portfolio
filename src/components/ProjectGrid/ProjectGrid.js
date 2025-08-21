// components/ProjectGrid/ProjectGrid.jsx
import projectsData from "../../data/projects.json";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./ProjectGrid.css";

export default function ProjectGrid() {
  const cardRefs = useRef([]); // holds refs to all cards

  const saveHomeScroll = () => {
    sessionStorage.setItem("homeScrollY", String(window.scrollY));
  };

  const onKeyDownSave = (e) => {
    // Save scroll when navigating via keyboard (Enter/Space)
    if (e.key === "Enter" || e.key === " ") {
      sessionStorage.setItem("homeScrollY", String(window.scrollY));
    }
  };

  useEffect(() => {
    // Only enable on mobile
    const mq = window.matchMedia("(max-width: 60rem)");
    if (!mq.matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            // If you want it to animate only once, unobserve:
            // io.unobserve(el);
          } else {
            // Remove if you want the effect to toggle when leaving
            el.classList.remove("in-view");
          }
        });
      },
      { threshold: 0.2 } // visible enough to trigger
    );

    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="projects-section">
      <h2 className="projects-title">WORK</h2>
      <div className="project-grid">
        {projectsData.projects.map((project, index) => (
          <Link
            key={index}
            to={`/projects/${index}`}
            className="project-card"
            aria-label={`View project: ${project.title}`}
            onClick={saveHomeScroll}
            onKeyDown={onKeyDownSave}
            ref={(el) => (cardRefs.current[index] = el)}
          >
            <img
              src={project.cover.path}
              alt={project.cover.alt}
              className="project-image"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
