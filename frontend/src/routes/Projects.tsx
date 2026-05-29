import { useState } from "react"

const projects = [
  {
    id: "agents",
    title: "Agents",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/jaenil/agents",
    cover:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "ignus-pre-reg",
    title: "Ignus Pre-Reg",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/AadityaSharma1001/Ignus-Pre-Reg/",
    cover:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "oceas",
    title: "Oceas",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/jaenil/oceas",
    cover:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "prml",
    title: "PRML",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/jaenil/PRML",
    cover:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "csl2020-project",
    title: "CSL2020 Project",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/jaenil/CSL2020-project",
    cover:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "admin-portal",
    title: "Admin Portal",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/AdityaPandey2006/AdminPortal",
    cover:
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "codifyr",
    title: "Codifyr",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/AdityaPandey2006/codifyr",
    cover:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "koha-backend",
    title: "Koha Backend",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/AdityaPandey2006/kohaBackend",
    cover:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "image-stitching",
    title: "Image Stitching",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
  
    href: "https://github.com/jaenil/image-stitching",
    cover:
      "https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&w=1400&q=80",

  },
  {
    id: "cipherkins-team2",
    title: "CipherKins",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/jaenil/CipherKins_Team2",
    cover:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "semantic-code-search",
    title: "Semantic Code Search",
    kind: "Project",
    description: "Open-source project on GitHub.",
    stack: ["NodeJS", "RabbitMQ", "React", "Postgres"],
    href: "https://github.com/jaenil/semantic_code_search",
    cover:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80",
  },
] as const

export default function Projects() {
  type ProjectId = (typeof projects)[number]["id"]
  const [activeId, setActiveId] = useState<ProjectId>(
    projects[0]?.id ?? "agents"
  )
  const activeProject =
    projects.find((project) => project.id === activeId) ?? projects[0]

  if (!activeProject) {
    return null
  }

  return (
    <main className="page-shell projects-page">
    <header className="projects-hero">
      <h1 className="projects-title">Projects</h1>
      <p className="projects-subtitle">A collection of things I've built and shipped.</p>
    </header>

    <section className="projects-layout">
      <article className="projects-preview">
        <div
          className="projects-preview-media"
          style={{ backgroundImage: `url('${activeProject.cover}')` }}
        >
          <div className="projects-preview-stack">
            {activeProject.stack.map((tool) => (
              <span key={tool} className="projects-preview-chip">
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div className="projects-preview-body">
          <h2 className="projects-preview-title">{activeProject.title}</h2>
          <p className="projects-preview-desc">
            {activeProject.description}
          </p>
          <a
            className="projects-preview-cta"
            href={activeProject.href}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </article>

      <aside className="projects-list">
        {projects.map((project, index) => (
          <button
            key={project.id}
            className={`project-row${activeId === project.id ? " is-active" : ""}`}
            type="button"
            onClick={() => setActiveId(project.id)}
          >
            <span className="project-row-number">{String(index).padStart(2, "0")}</span>
            <img className="project-row-thumb" src={project.cover} alt="" />
            <span className="project-row-meta">
              <span className="project-row-title">{project.title}</span>
              <span className="project-row-subtitle">{project.kind}</span>
            </span>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>
          
        ))}
      </aside>
    </section>
</main>
  )
}
