// pages/ProjectPage.js
import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import projectsData from "../data/projects.json";
import "./ProjectPage.css"; // opcional

export default function ProjectPage() {
  const { id } = useParams();
  const location = useLocation();

  // garantir scroll top quando navegas para um projeto
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // obter projeto pelo índice (ou podes mudar para slug no futuro)
  const project = useMemo(() => {
    const idx = Number(id);
    if (!Number.isInteger(idx)) return null;
    return projectsData.projects[idx] ?? null;
  }, [id]);

  // SEO básico: atualiza o título
  useEffect(() => {
    document.title = project ? `${project.title} · Portfolio` : "Projeto não encontrado · Portfolio";
  }, [project]);

  if (!project) {
    return (
      <section className="project-detail">
        <div className="container">
          <p>Projeto não encontrado.</p>
          <Link to="/" className="back-link">← Voltar</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="project-detail">
      <div className="container">
        <nav className="project-nav">
          <Link to="/" className="back-link">← Voltar</Link>
          {project["github-link"] && (
            <a
              href={project["github-link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              Ver no GitHub
            </a>
          )}
        </nav>

        <header className="project-header">
          <h1 className="project-title">{project.title}</h1>
        </header>

        {/* tens HTML no description (ex.: link Behance), por isso uso innerHTML */}
        <p
          className="project-description"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        {project.tools?.length > 0 && (
          <ul className="project-tools">
            {project.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        )}

        <div className="project-gallery">
          {/* capa */}
          <img
            src={project.cover.path}
            alt={project.cover.alt}
            className="project-cover"
            loading="lazy"
          />
  
          {project.images?.map((img, i) => (
            <img
              key={i}
              src={img.path}
              alt={img.alt}
              className="project-image"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
