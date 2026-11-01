import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** Animates a number toward `target` (ease out). Starts from 0 on mount; jumps when motion is reduced. */
export function useCountUp(target, { duration = 800 } = {}) {
  const reduced = useReducedMotion()
  const current = useRef(reduced ? target : 0)
  const [value, setValue] = useState(current.current)

  useEffect(() => {
    if (reduced) {
      current.current = target
      setValue(target)
      return undefined
    }
    const origin = current.current
    let start
    let frame
    const tick = (time) => {
      start ??= time
      const progress = Math.min(1, (time - start) / duration)
      current.current = origin + (target - origin) * (1 - (1 - progress) ** 3)
      setValue(current.current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])

  return value
}
