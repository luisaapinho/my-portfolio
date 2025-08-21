import { useParams, Link, useNavigate } from "react-router-dom";
import projectsData from "../data/projects.json";
import "./ProjectPage.css";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idx = Number(id);
  const project =
    Number.isInteger(idx) && idx >= 0 && idx < projectsData.projects.length
      ? projectsData.projects[idx]
      : null;

  if (!project) {
    return (
      <section className="project-detail">
        <div className="container">
          <p>Project not found.</p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </section>
    );
  }

  // Determine the cover image for the header
  const coverFromImages =
    project.images?.find(img => /cover-?02\./i.test(img.path)) ||
    project.images?.[0] ||
    null;

  const headerCover = coverFromImages || project.cover;
  const headerCoverPath = headerCover.path;
  const headerCoverAlt = headerCover.alt;

  // Filter out the cover image from the gallery
  const galleryImages = (project.images || []).filter(img => {
    if (!coverFromImages) return true; 
    return img.path !== coverFromImages.path; 
  });

  // Handle contact navigation manually
  const goToContact = () => {
    navigate("/"); // go home first
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // small delay so home is mounted
  };

  return (
    <article className="project-detail">
      {/* --- Cover (full width) --- */}
      <div className="project-cover-wrap">
        <img
          className="project-cover"
          src={headerCoverPath}
          alt={headerCoverAlt}
        />
      </div>

      <div className="container">
        {/* --- Line 1: Project Title --- */}
        <header className="project-header">
          <h1 className="project-title">{project.title}</h1>
        </header>

        {/* --- Line 2: Two columns: description + metadata --- */}
        <section className="project-body">
          <div
            className="project-description"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />

          <aside className="project-meta">
            <dl>
              {project.year && (
                <>
                  <dt>YEAR:</dt><dd>{project.year}</dd>
                </>
              )}
              {project.type && (
                <>
                  <dt>TYPE:</dt><dd>{project.type}</dd>
                </>
              )}
              {!!project.tools?.length && (
                <>
                  <dt>TECH STACK:</dt>
                  <dd>{project.tools.join(", ")}</dd>
                </>
              )}
              {project["github-link"] && (
                <>
                  <dt>GITHUB-LINK:</dt>
                  <dd>
                    <a
                      href={project["github-link"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meta-link"
                    >
                      {project["github-link"]}
                    </a>
                  </dd>
                </>
              )}
            </dl>
            <button onClick={goToContact} className="contact-cta">
              CONTACT ME ↗
            </button>
          </aside>
        </section>

        {/* --- Line 3: Gallery title --- */}
        {galleryImages.length > 0 && (
          <h2 className="project-photos-title">Photos of the Project</h2>
        )}

        {/* --- Line 4: Gallery (one image per row, alt on hover) --- */}
        <section className="project-gallery">
          {galleryImages.map((img, i) => (
            <div className="gallery-item" key={i}>
              <img src={img.path} alt={img.alt} loading="lazy" />
              <span className="img-alt">{img.alt}</span>
            </div>
          ))}
        </section>

        {/* --- Close link --- */}
        <nav className="detail-nav">
          <Link to="/" className="back-link left">CLOSE↖</Link>
          <Link to="/" className="back-link right">CLOSE↖</Link>
        </nav>
      </div>
    </article>
  );
}
