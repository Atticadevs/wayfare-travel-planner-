import { useEffect, useState } from 'react'
import { animate, useMotionValue } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

/** Animates a number toward `target` (ease out). Starts from 0 on mount; jumps when motion is reduced. */
export function useCountUp(target, { duration = 800 } = {}) {
  const reduced = useReducedMotion()
  const motionValue = useMotionValue(reduced ? target : 0)
  const [value, setValue] = useState(motionValue.get())

  useEffect(() => motionValue.on('change', setValue), [motionValue])

  useEffect(() => {
    if (reduced) {
      motionValue.jump(target)
      return undefined
    }
    const controls = animate(motionValue, target, { duration: duration / 1000, ease: 'easeOut' })
    return () => controls.stop()
  }, [target, duration, reduced, motionValue])

  return value
}
