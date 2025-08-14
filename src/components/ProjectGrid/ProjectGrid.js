import projectsData from "../../data/projects.json";
import "./ProjectGrid.css";


export default function ProjectGrid() {
  return (
    
    <section className="projects-section">
      
      <h2 className="projects-title">WORK</h2>
      <div className="project-grid">
        {projectsData.projects.map((project, index) => (
          <a
            key={index}
            href={`projects/${index}`}
            className="project-card"
            aria-label={`View project: ${project.title}`}
          >
            <img
              src={project.cover.path}
              alt={project.cover.alt}
              className="project-image"
            />
          </a>
        ))}
      </div>
    </section>
  );
}