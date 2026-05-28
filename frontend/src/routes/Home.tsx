import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

import avatarPortrait from "../assets/pic.jpg"
import sunflowerAudio from "../assets/songs/sunflower.mp3"
import hereWeGoAudio from "../assets/songs/here_we_go.mp3"
import seeYouAgainAudio from "../assets/songs/see_you_again.mp3"
import sunflowerCover from "../assets/covers/sunflower.jpeg"
import pumpedUpKicksCover from "../assets/covers/pumped-up-kicks.jpeg"
import seeYouAgainCover from "../assets/covers/see-you-again.jpeg"

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

  return (
    <motion.main
      className="page-shell page-shell-home"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <section className="home-layout">
        <div className="about-shell">
          <div className="about-header">
            <button className="menu-button" type="button" aria-label="Open menu">
              <i className="bi bi-list" aria-hidden="true" />
            </button>

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
              <span className="about-code">404</span>
            </div>
            <div className="about-role">Developer • Student</div>

            <div className="about-links">
              <ul className="social-list">
                <li>
                  <a
                    className="social-link"
                    href="https://github.com/jaenil"
                    aria-label="GitHub"
                  >
                    <i className="bi bi-github" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    className="social-link"
                    href="https://www.linkedin.com/in/jaenil-parekh/"
                    aria-label="LinkedIn"
                  >
                    <i className="bi bi-linkedin" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a className="social-link" href="#" aria-label="Instagram">
                    <i className="bi bi-instagram" aria-hidden="true" />
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
              <div className="featured-track">
                <article className="featured-slide is-active">
                  <a
                    className="featured-link"
                    href="https://github.com/jaenil/oceas"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className="featured-image"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')",
                      }}
                    >
                      <div className="featured-caption">
                        <div className="featured-title">Oceas</div>
                        <div className="featured-desc">
                          Open-source project on GitHub.
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
                <article className="featured-slide">
                  <a
                    className="featured-link"
                    href="https://github.com/jaenil/agents"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className="featured-image"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80')",
                      }}
                    >
                      <div className="featured-caption">
                        <div className="featured-title">Agents</div>
                        <div className="featured-desc">
                          Open-source project on GitHub.
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
                <article className="featured-slide">
                  <a
                    className="featured-link"
                    href="https://github.com/AadityaSharma1001/Ignus-Pre-Reg"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div
                      className="featured-image"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80')",
                      }}
                    >
                      <div className="featured-caption">
                        <div className="featured-title">Ignus Pre-Reg</div>
                        <div className="featured-desc">
                          Open-source project on GitHub.
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              </div>

              <button
                className="slider-arrow slider-arrow-left"
                type="button"
                aria-label="Previous slide"
              >
                <i className="bi bi-chevron-left" aria-hidden="true" />
              </button>
              <button
                className="slider-arrow slider-arrow-right"
                type="button"
                aria-label="Next slide"
              >
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>

              <div className="slider-dots" aria-hidden="true">
                <span className="slider-dot is-active" />
                <span className="slider-dot" />
                <span className="slider-dot" />
              </div>
            </div>
          </div>

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
    </motion.main>
  )
}
