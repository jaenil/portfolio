import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'

declare const __LAST_UPDATED__: string

import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import Home from './routes/Home.tsx'
import Projects from './routes/Projects.tsx'
import Connect from './routes/Connect.tsx'
import Lifestyle from './routes/Lifestyle.tsx'
import WorkDetail from './routes/Work.$slug.tsx'
import NotFound from './routes/NotFound.tsx'

type Theme = 'dark' | 'light'

const themeStorageKey = 'theme-preference'
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark'
  }
  const storedTheme = window.localStorage.getItem(themeStorageKey)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

const timings = {
  out: 660,
  hold: 600,
  in: 660,
  stagger: 70,
} as const

type TransitionPhase = 'idle' | 'leaving' | 'entering'

type AppShellProps = {
  isDark: boolean
  onThemeToggle: () => void
}

function AppShell({ isDark, onThemeToggle }: AppShellProps) {
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const timeoutsRef = useRef<number[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  const clearTimers = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timeoutsRef.current.push(id)
  }

  const runTransition = (to: string) => {
    if (phase !== 'idle') {
      return
    }

    if (to === location.pathname) {
      return
    }

    setPhase('leaving')

    schedule(() => {
      navigate(to)
      setPhase('entering')
      schedule(() => {
        setPhase('idle')
      }, timings.in)
    }, timings.out + timings.hold)
  }

  const handleNav =
    (to: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      if (event.button !== 0) {
        return
      }

      event.preventDefault()
      runTransition(to)
    }

  const overlayStyle = {
    ['--pt-out' as string]: `${timings.out}ms`,
    ['--pt-hold' as string]: `${timings.hold}ms`,
    ['--pt-in' as string]: `${timings.in}ms`,
    ['--pt-stagger' as string]: `${timings.stagger}ms`,
  } as CSSProperties

  return (
    <>
      <div
        className={`page-transition${
          phase === 'leaving'
            ? ' is-leaving'
            : phase === 'entering'
              ? ' is-entering'
              : ''
        }`}
        style={overlayStyle}
        aria-hidden="true"
      >
        <div className="page-transition__panel page-transition__panel--tl" />
        <div className="page-transition__panel page-transition__panel--br" />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <nav className="bottom-bar" aria-label="Primary">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `bottom-link${isActive ? ' is-active' : ''}`
          }
          onClick={handleNav('/')}
          aria-label="Home"
        >
          <i className="bi bi-house-door" aria-hidden="true" />
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `bottom-link${isActive ? ' is-active' : ''}`
          }
          onClick={handleNav('/projects')}
          aria-label="Projects"
        >
          <i className="bi bi-display" aria-hidden="true" />
        </NavLink>
        <NavLink
          to="/connect"
          className={({ isActive }) =>
            `bottom-link${isActive ? ' is-active' : ''}`
          }
          onClick={handleNav('/connect')}
          aria-label="Connect"
        >
          <i className="bi bi-hash" aria-hidden="true" />
        </NavLink>
        <NavLink
          to="/lifestyle"
          className={({ isActive }) =>
            `bottom-link${isActive ? ' is-active' : ''}`
          }
          onClick={handleNav('/lifestyle')}
          aria-label="Lifestyle"
        >
          <i className="bi bi-share" aria-hidden="true" />
        </NavLink>
        <button
          className="bottom-link theme-toggle"
          type="button"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={!isDark}
          onClick={onThemeToggle}
        >
          <i
            className={`bi ${isDark ? 'bi-sun' : 'bi-moon-stars'}`}
            aria-hidden="true"
          />
        </button>
      </nav>
    </>
  )
}
export default function App() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const isDark = theme === 'dark'

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    window.localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  const handleThemeToggle = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }
  return (
    <div className="app-container">
      <BrowserRouter>
        <AppShell isDark={isDark} onThemeToggle={handleThemeToggle} />
      </BrowserRouter>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <p className="footer-kicker">Designed and developed by</p>
            <p className="footer-meta">(c) Jaenil Parekh</p>
          </div>
          <div className="footer-links">
            <span className="footer-meta">Last updated: {__LAST_UPDATED__}</span>
            <a className="footer-link" href="../public/resume.pdf" target="_blank">
              <span>Resume</span>
              <i className="bi bi-arrow-up-right" aria-hidden="true" />
            </a>
          </div>
          <a className="footer-email" href="mailto:jaenilparekh@gmail.com">
            @jaenilparekh@gmail.com
          </a>
          <span className="footer-mark" aria-hidden="true">jaenil</span>
        </div>
      </footer>
    </div>
  )
}
