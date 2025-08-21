// components/ProjectGrid/ProjectGrid.jsx
import projectsData from "../../data/projects.json";
import { Link } from "react-router-dom";
import "./ProjectGrid.css";

export default function ProjectGrid() {
  const saveHomeScroll = () => {
    sessionStorage.setItem("homeScrollY", String(window.scrollY));
  };

  const onKeyDownSave = (e) => {
    // Save scroll when navigating via keyboard (Enter/Space)
    if (e.key === "Enter" || e.key === " ") {
      sessionStorage.setItem("homeScrollY", String(window.scrollY));
    }
  };

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
