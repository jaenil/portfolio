import { useState } from "react"
const ignus_logo = Object.values(
  import.meta.glob("../assets/ignus_logo.png", {
    eager: true,
    query: "?w=1100&format=webp&quality=80",
    import: "default",
  })
) as string[]
const oceas_logo = Object.values(
  import.meta.glob("../assets/oceas.png", {
    eager: true,
    query: "?w=1100&format=webp&quality=80",
    import: "default",
  })
) as string[]
const csl2020 = Object.values(
  import.meta.glob("../assets/csl2020.png", {
    eager: true,
    query: "?w=1100&format=webp&quality=80",
    import: "default",
  })
) as string[]
const cipherkins = Object.values(
  import.meta.glob("../assets/cipherkins.png", {
    eager: true,
    query: "?w=1100&format=webp&quality=80",
    import: "default",
  })
) as string[]

const projects = [
  {
    id: "finsage",
    title: "FinSage",
    kind: "Project",
    description:
      "Multi-agent trading assistant combining technical, sentiment, fundamentals, risk, and portfolio reasoning into one explainable pipeline. ",
    stack: ["Python", "LLM Agents", "React", "FastAPI", "Docker"],
    href: "https://github.com/jaenil/agents",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "ignus-pre-reg",
    title: "Ignus '26 Official Website",
    kind: "Website",
    description:
      "Built IIT Jodhpur's official Ignus '26 website scaled to 6,000+ peak users with 99.99% uptime.",
    stack: [
      "React",
      "Firebase",
      "JavaScript",
      "REST APIs",
    ],
    href: "https://github.com/AadityaSharma1001/Ignus-Pre-Reg/",
    cover:
      ignus_logo[0],
  },
  {
    id: "oceas",
    title: "OCEAS",
    kind: "Course Project",
    description:
      "Built a proctored online coding exam platform with role-based access (Admin, Instructor, Student), multi-language execution via JDoodle, and client-side face detection using MediaPipe Tasks Vision with exam-lock enforcement. ",
    stack: [
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Supabase",
      "Node.js",
      "MediaPipe",
    ],
    href: "https://github.com/jaenil/oceas",
    cover:
      oceas_logo[0],
  },
  {
    id: "prml",
    title: "PRML",
    kind: "Course Project",
    description: "A speech noise reduction pipeline comparing PCA-based linear subspace projection against a nonlinear ResUNet deep learning model to extract clean speech from noisy audio.",
    stack: ["Python", "Machine Learning", "signal processing"],
    href: "https://github.com/jaenil/PRML",
    cover:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "cipherkins-team",
    title: "CipherKins",
    kind: "Hackathon",
    description: "An AI-powered Android engine that passively monitors device usage to detect distraction drift and project semester outcomes. Integrates Google APIs and Groq LLMs to generate predictive nudges and automated task execution plans.",
    stack: ["React Native", "Node.js", "Supabase", "Groq AI"],
    href: "https://github.com/jaenil/CipherKins_Team2",
    cover: cipherkins[0],
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
  {
    id: "csl2020-project",
    title: "CSL2020 Project: Airline Route Management",
    kind: "Course Project",
    description: "A React-based graph visualizer and analysis dashboard for airport routes. Implements core graph algorithms like Dijkstra to calculate optimal flight paths in real-time",
    stack: ["NodeJS", "TailwindCss", "React"],
    href: "https://github.com/jaenil/CSL2020-project",
    cover:
      csl2020[0],
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
              <span className="project-row-number">{String(index + 1).padStart(2, "0")}</span>
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
