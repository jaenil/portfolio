import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'

import Home from './routes/Home.tsx'
import Projects from './routes/Projects.tsx'
import Connect from './routes/Connect.tsx'
import Lifestyle from './routes/Lifestyle.tsx'
import WorkDetail from './routes/Work.$slug.tsx'
import NotFound from './routes/NotFound.tsx'

type Theme = 'dark' | 'light'

const themeStorageKey = 'theme-preference'

const routeVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
}

const routeTransition = { duration: 0.45 }

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="route-shell"
        variants={routeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={routeTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

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
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AnimatedRoutes />

        <nav className="bottom-bar" aria-label="Primary">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `bottom-link${isActive ? ' is-active' : ''}`
            }
            aria-label="Home"
          >
            <i className="bi bi-house-door" aria-hidden="true" />
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `bottom-link${isActive ? ' is-active' : ''}`
            }
            aria-label="Projects"
          >
            <i className="bi bi-display" aria-hidden="true" />
          </NavLink>
          <NavLink
            to="/connect"
            className={({ isActive }) =>
              `bottom-link${isActive ? ' is-active' : ''}`
            }
            aria-label="Connect"
          >
            <i className="bi bi-hash" aria-hidden="true" />
          </NavLink>
          <NavLink
            to="/lifestyle"
            className={({ isActive }) =>
              `bottom-link${isActive ? ' is-active' : ''}`
            }
            aria-label="Lifestyle"
          >
            <i className="bi bi-share" aria-hidden="true" />
          </NavLink>
          <button
            className="bottom-link theme-toggle"
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={!isDark}
            onClick={handleThemeToggle}
          >
            <i
              className={`bi ${isDark ? 'bi-sun' : 'bi-moon-stars'}`}
              aria-hidden="true"
            />
          </button>
        </nav>
      </MotionConfig>
    </BrowserRouter>
  )
}
