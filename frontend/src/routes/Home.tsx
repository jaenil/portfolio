import { useEffect, useMemo, useRef, useState } from "react"
import avatarPortrait from "../assets/pic.jpg"
import sunflowerAudio from "../assets/songs/sunflower.mp3"
import hereWeGoAudio from "../assets/songs/here_we_go.mp3"
import seeYouAgainAudio from "../assets/songs/see_you_again.mp3"
import sunflowerCover from "../assets/covers/sunflower.jpeg"
import pumpedUpKicksCover from "../assets/covers/pumped-up-kicks.jpeg"
import seeYouAgainCover from "../assets/covers/see-you-again.jpeg"
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
const playlist = [
  {
    id: "energy",
    label: "energy",
    title: "Sunflower",
    artist: "Post Malone • Swae Lee",
    audioSrc: sunflowerAudio,
    coverSrc: sunflowerCover,
  },
  {
    id: "focus",
    label: "focus",
    title: "Pumped Up Kicks",
    artist: "Foster the People",
    audioSrc: hereWeGoAudio,
    coverSrc: pumpedUpKicksCover,
  },
  {
    id: "chill",
    label: "chill",
    title: "See You Again",
    artist: "Wiz Khalifa • Charlie Puth",
    audioSrc: seeYouAgainAudio,
    coverSrc: seeYouAgainCover,
  },
] as const

type TrackId = (typeof playlist)[number]["id"]

// ─── GitHub Contributions Heatmap ────────────────────────────────────────────

type ContribDay = { date: string; count: number }

const CELL = 11
const GAP = 3
const WEEKS = 52
const DAYS = 7

// Blue palette: level 0 → 4
const LEVELS = [
  "rgba(30, 32, 44, 0.9)",   // 0 — empty
  "rgba(42, 62, 130, 0.85)", // 1 — low
  "rgba(55, 90, 185, 0.88)", // 2 — medium-low
  "rgba(70, 122, 230, 0.92)", // 3 — medium-high
  "rgba(99, 163, 255, 1)",   // 4 — high
]

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function getLevel(count: number, max: number): number {
  if (count === 0) return 0
  if (max === 0) return 0
  const ratio = count / max
  if (ratio < 0.15) return 1
  if (ratio < 0.40) return 2
  if (ratio < 0.70) return 3
  return 4
}

function GithubContributions({ username }: { username: string }) {
  const [days, setDays] = useState<ContribDay[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")

  useEffect(() => {
    const controller = new AbortController()
    const url = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed")
        return r.json()
      })
      .then((data) => {
        const contributions: ContribDay[] = data.contributions ?? []
        setDays(contributions)
        setTotal(data.total?.lastYear ?? contributions.reduce((s: number, d: ContribDay) => s + d.count, 0))
        setStatus("ok")
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return
        setStatus("error")
      })

    return () => controller.abort()
  }, [username])

  // Build a 52-week grid (Sun → Sat columns)
  const grid = useMemo(() => {
    if (!days.length) return []
    // take last 364 days (52 × 7)
    const slice = days.slice(-364)
    const weeks: ContribDay[][] = []
    for (let w = 0; w < WEEKS; w++) {
      weeks.push(slice.slice(w * DAYS, w * DAYS + DAYS))
    }
    return weeks
  }, [days])

  const max = useMemo(
    () => Math.max(...days.map((d) => d.count), 1),
    [days]
  )

  // Compute month label positions
  const monthLabels = useMemo(() => {
    if (!grid.length) return []
    const labels: { label: string; x: number }[] = []
    let lastMonth = -1
    grid.forEach((week, wi) => {
      if (!week[0]) return
      const m = new Date(week[0].date).getMonth()
      if (m !== lastMonth) {
        labels.push({ label: MONTHS[m], x: wi * (CELL + GAP) })
        lastMonth = m
      }
    })
    return labels
  }, [grid])

  const svgWidth = WEEKS * (CELL + GAP) - GAP
  const svgHeight = DAYS * (CELL + GAP) - GAP
  const MONTH_ROW = 18
  const totalHeight = MONTH_ROW + svgHeight

  return (
    <div className="gh-contrib-card" aria-label="GitHub contribution heatmap">
      <div className="gh-contrib-header">
        <span className="gh-contrib-title">
          <i className="bi bi-github" aria-hidden="true" />
          GitHub Contributions
        </span>
        {status === "ok" && (
          <span className="gh-contrib-total">
            {total.toLocaleString()} this year
          </span>
        )}
      </div>

      {status === "loading" && (
        <div className="gh-contrib-skeleton" aria-busy="true">
          <div className="gh-contrib-pulse" />
        </div>
      )}

      {status === "error" && (
        <div className="gh-contrib-empty">
          Couldn't load contributions
        </div>
      )}

      {status === "ok" && (
        <>
          <svg
            className="gh-contrib-svg"
            viewBox={`0 0 ${svgWidth} ${totalHeight}`}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          >
            {/* Month labels */}
            {monthLabels.map(({ label, x }) => (
              <text
                key={`${label}-${x}`}
                x={x}
                y={MONTH_ROW - 5}
                fontSize="8"
                fill="rgba(244,244,245,0.45)"
                fontFamily="var(--font-sans, system-ui)"
              >
                {label}
              </text>
            ))}

            {/* Cells */}
            {grid.map((week, wi) =>
              week.map((day, di) => (
                <rect
                  key={day.date}
                  x={wi * (CELL + GAP)}
                  y={MONTH_ROW + di * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  ry={2}
                  fill={LEVELS[getLevel(day.count, max)]}
                >
                  <title>{`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}</title>
                </rect>
              ))
            )}
          </svg>

          <div className="gh-contrib-legend" aria-label="Contribution scale">
            <span className="gh-contrib-legend-label">Less</span>
            {LEVELS.map((color, i) => (
              <span
                key={i}
                className="gh-contrib-legend-cell"
                style={{ background: color }}
              />
            ))}
            <span className="gh-contrib-legend-label">More</span>
          </div>
        </>
      )}
    </div>
  )
}

export default function Home() {
  const [codeforcesRating, setCodeforcesRating] = useState("—")
  const codeforcesHandle = "jp_1"
  const [activeTrackId, setActiveTrackId] = useState<TrackId>(playlist[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeTrack =
    playlist.find((track) => track.id === activeTrackId) ?? playlist[0]

  useEffect(() => {
    const controller = new AbortController()

    const loadRating = async () => {
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.info?handles=${codeforcesHandle}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error("Codeforces request failed")
        }

        const data = await response.json()
        const rating = data?.result?.[0]?.rating

        if (typeof rating === "number") {
          setCodeforcesRating(`${rating}`)
        } else {
          setCodeforcesRating("Unrated")
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        setCodeforcesRating("Unavailable")
      }
    }

    loadRating()

    return () => controller.abort()
  }, [codeforcesHandle])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = 0

    if (!isPlaying) {
      return
    }

    audio.play().catch(() => {
      setIsPlaying(false)
    })
  }, [activeTrackId, isPlaying])

  const handleTogglePlay = () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
      return
    }

    audio.pause()
    setIsPlaying(false)
  }
  const featuredProjects = [
  {
    id: "oceas",
    title: "Oceas",
    description: "Proctored coding exam platform with multi-language execution and face detection.",
    href: "https://github.com/jaenil/oceas",
    cover:oceas_logo[0],
  },
  {
    id: "finsage",
    title: "FinSage",
    description: "Multi-agent trading assistant with explainable technical & sentiment analysis.",
    href: "https://github.com/jaenil/agents",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "ignus-pre-reg",
    title: "Ignus Pre-Reg",
    description: "Scaled IIT Jodhpur's Ignus '26 website to 6,000+ users with 99.99% uptime.",
    href: "https://github.com/AadityaSharma1001/Ignus-Pre-Reg",
    cover:ignus_logo[0],
  },
] as const
const [activeFeature, setActiveFeature] = useState(0)
const trackRef = useRef<HTMLDivElement | null>(null)
const scrollToFeature = (index: number) => {
  const track = trackRef.current
  if (!track) return

  const width = track.clientWidth
  track.scrollTo({ left: width * index, behavior: "smooth" })
  setActiveFeature(index)
}

const handlePrev = () => {
  const nextIndex =
    (activeFeature - 1 + featuredProjects.length) % featuredProjects.length
  scrollToFeature(nextIndex)
}

const handleNext = () => {
  const nextIndex = (activeFeature + 1) % featuredProjects.length
  scrollToFeature(nextIndex)
}
const autoSlideDelay = 2480

useEffect(() => {
  if (featuredProjects.length < 2) {
    return
  }

  const id = window.setInterval(() => {
    setActiveFeature((prev) => {
      const next = (prev + 1) % featuredProjects.length
      const track = trackRef.current

      if (track) {
        track.scrollTo({ left: track.clientWidth * next, behavior: "smooth" })
      }

      return next
    })
  }, autoSlideDelay)

  return () => window.clearInterval(id)
}, [autoSlideDelay, featuredProjects.length])
  return (
    <main className="page-shell page-shell-home">
      <section className="home-layout">
        <div className="about-shell">
          <div className="about-header">
            

            <div className="about-heading">
              <i className="bi bi-stars sparkle-icon" aria-hidden="true" />
              <span>About Me</span>
            </div>
          </div>

          <div className="side-rail">
            <span>Linux</span>
            <span>Networks</span>
            <span>SystemDesign</span>
            <span>Workflow</span>
          </div>

          <article className="about-card">
            <div className="about-avatar">
              <img src={avatarPortrait} alt="Jaenil portrait" />
            </div>

            <div className="about-name">
              I'm <strong>Jaenil</strong>
              
            </div>
            <div className="about-role">Developer • Student</div>

            <div className="about-links">
              <ul className="social-list">
                <li>
                  <a
                    className="social-link"
                    href="https://github.com/jaenil"
                    aria-label="GitHub"
                    target="_blank"
                  >
                    <i className="bi bi-github" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    className="social-link"
                    href="https://www.linkedin.com/in/jaenil-parekh/"
                    aria-label="LinkedIn"
                    target="_blank"
                  >
                    <i className="bi bi-linkedin" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a className="social-link" href="#" aria-label="Instagram">
                    <i className="bi bi-instagram" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    className="social-link"
                    href="https://discord.com/users/758287475445334027"
                    aria-label="Discord"
                    target="_blank"
                  >
                    <i className="bi bi-discord" aria-hidden="true" />
                  </a>
                </li>
              </ul>

              <a className="pill-button works-button" href="/projects">
                <span>Works</span>
                <i className="bi bi-arrow-right" aria-hidden="true" />
              </a>
            </div>

            <a className="email-link" href="mailto:jaenilparekh@gmail.com">
              jaenilparekh@gmail.com
            </a>
          </article>
        </div>

        <div className="portfolio-panel">
          <h1 className="portfolio-title">Portfolio</h1>

          <div className="featured-row">
            <div className="featured-slider">
              <div className="featured-track" ref={trackRef}>
  {featuredProjects.map((project, index) => (
    <article
      key={project.id}
      className={`featured-slide${index === activeFeature ? " is-active" : ""}`}
    >
      <a
        className="featured-link"
        href={project.href}
        target="_blank"
        rel="noreferrer"
      >
        <div
          className="featured-image"
          style={{ backgroundImage: `url('${project.cover}')` }}
        >
          <div className="featured-caption">
            <div className="featured-title">{project.title}</div>
            <div className="featured-desc">{project.description}</div>
          </div>
        </div>
      </a>
    </article>
  ))}
</div>

              <button
  className="slider-arrow slider-arrow-left"
  type="button"
  aria-label="Previous slide"
  onClick={handlePrev}
>
  <i className="bi bi-chevron-left" aria-hidden="true" />
</button>

<button
  className="slider-arrow slider-arrow-right"
  type="button"
  aria-label="Next slide"
  onClick={handleNext}
>
  <i className="bi bi-chevron-right" aria-hidden="true" />
</button>

<div className="slider-dots" aria-hidden="true">
  {featuredProjects.map((project, index) => (
    <span
      key={project.id}
      className={`slider-dot${index === activeFeature ? " is-active" : ""}`}
    />
  ))}
</div>
            </div>
          </div>

          <GithubContributions username="jaenil" />

          <div className="aux-row">
            <div className="now-playing-card">
              <div
                className="now-playing-art"
                style={{ backgroundImage: `url(${activeTrack.coverSrc})` }}
              />
              <div className="now-playing-info">
                <span className="now-playing-label">Listening now</span>
                <div className="now-playing-title">{activeTrack.title}</div>
                <div className="now-playing-meta">{activeTrack.artist}</div>
                <div className="now-playing-tags">
                  {playlist.map((track) => (
                    <button
                      key={track.id}
                      className={`now-playing-tag${
                        track.id === activeTrackId ? " is-active" : ""
                      }`}
                      type="button"
                      onClick={() => setActiveTrackId(track.id)}
                    >
                      {track.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="now-playing-actions">
                <button
                  className="control-button control-button-play"
                  type="button"
                  aria-label="Play track"
                  aria-pressed={isPlaying}
                  onClick={handleTogglePlay}
                >
                  <i
                    className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <audio
                className="now-playing-audio"
                preload="none"
                src={activeTrack.audioSrc}
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
            <div className="stat-card codeforces-card">
              <div className="stat-value">{codeforcesRating}</div>
              <div className="stat-label">Codeforces Rating</div>
              <div className="stat-caption">@{codeforcesHandle}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
