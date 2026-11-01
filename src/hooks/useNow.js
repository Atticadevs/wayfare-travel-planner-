import { useEffect, useState } from 'react'

/** Current Date, refreshed every `intervalMs` (live countdowns, status rollover at midnight). */
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
  return now
}
