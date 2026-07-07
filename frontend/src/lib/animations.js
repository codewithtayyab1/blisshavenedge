import { useReducedMotion } from 'framer-motion'

export const fadeUpVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const staggerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// Custom hook — call once per page component, destructure what you need
export function useAnims() {
  const reduced = useReducedMotion()

  const scrollFade = (delay = 0) =>
    reduced
      ? {}
      : {
          initial:     { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport:    { once: true, margin: '-60px' },
          transition:  { duration: 0.55, ease: 'easeOut', delay },
        }

  const stagger = reduced
    ? {}
    : {
        variants:    staggerVariants,
        initial:     'hidden',
        whileInView: 'visible',
        viewport:    { once: true, margin: '-60px' },
      }

  const card = reduced ? {} : { variants: fadeUpVariants }

  return { scrollFade, stagger, card }
}
