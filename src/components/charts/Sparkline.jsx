import { motion } from 'framer-motion'
import { ease } from '../../lib/motion'

const WIDTH = 100
const HEIGHT = 32
const PAD = 3

/** Tiny line chart that draws itself on mount. `data` is a list of numbers. */
export function Sparkline({ data, tone = 'primary', label }) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const span = max - min || 1
  const points = data.map((v, i) => [
    PAD + (i / Math.max(data.length - 1, 1)) * (WIDTH - PAD * 2),
    HEIGHT - PAD - ((v - min) / span) * (HEIGHT - PAD * 2),
  ])
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const last = points[points.length - 1]
  const color = `rgb(var(--${tone}))`

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${label}: ${data.join(', ')}`} className="h-8 w-full overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
      />
      <motion.circle
        cx={last[0]}
        cy={last[1]}
        r="2.5"
        fill={color}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      />
    </svg>
  )
}
