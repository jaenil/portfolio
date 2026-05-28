export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
} as const

export const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
} as const

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1 }
} as const
