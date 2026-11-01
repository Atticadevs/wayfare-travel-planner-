import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import { useTripStore } from '../store/useTripStore'

/** True when the OS or the Settings override asks for reduced motion. */
export function useReducedMotion() {
  const system = useFramerReducedMotion()
  const override = useTripStore((s) => s.settings.reducedMotion)
  return Boolean(system || override)
}
