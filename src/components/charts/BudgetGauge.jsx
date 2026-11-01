import { useEffect, useRef } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { chartViewport } from '../../lib/motion'
import { formatMoney } from '../../lib/format'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const CENTER = 100
const RADIUS = 80
const NEEDLE = 62
const ARC = `M ${CENTER - RADIUS} ${CENTER} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER + RADIUS} ${CENTER}`

/** Gentle thresholds: green below 80%, amber from 80%, red at 100%. */
export function gaugeTone(ratio) {
  if (ratio >= 1) return 'danger'
  if (ratio >= 0.8) return 'warning'
  return 'success'
}

/** Semi-circular budget gauge. The needle springs to the spent ratio; the arc fills to match. */
export function BudgetGauge({ spent, budget, currency, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, chartViewport)
  const reduced = useReducedMotion()
  const ratio = budget > 0 ? spent / budget : 0
  const clamped = Math.min(ratio, 1)
  const tone = gaugeTone(ratio)
  const remaining = budget - spent

  const value = useSpring(0, { stiffness: 120, damping: 14 })
  useEffect(() => {
    if (!inView) return
    if (reduced) value.jump(clamped)
    else value.set(clamped)
  }, [inView, clamped, reduced, value])

  const arcLength = useTransform(value, (v) => Math.max(0, Math.min(1, v)))
  const needleX = useTransform(value, (v) => CENTER + NEEDLE * Math.sin((v - 0.5) * Math.PI))
  const needleY = useTransform(value, (v) => CENTER - NEEDLE * Math.cos((v - 0.5) * Math.PI))

  const summary = `Budget gauge: ${Math.round(ratio * 100)}% used. ${formatMoney(spent, currency)} spent of ${formatMoney(budget, currency)}. ${
    remaining >= 0 ? `${formatMoney(remaining, currency)} remaining.` : `${formatMoney(-remaining, currency)} over budget.`
  }`

  return (
    <svg ref={ref} viewBox="0 0 200 120" role="img" aria-label={summary} tabIndex={0} className={className}>
      <title>{summary}</title>
      <path d={ARC} fill="none" stroke="rgb(var(--border))" strokeWidth="14" strokeLinecap="round" />
      <motion.path
        d={ARC}
        fill="none"
        stroke={`rgb(var(--${tone}))`}
        strokeWidth="14"
        strokeLinecap="round"
        style={{ pathLength: arcLength }}
      />
      <motion.line x1={CENTER} y1={CENTER} x2={needleX} y2={needleY} stroke="rgb(var(--text))" strokeWidth="3" strokeLinecap="round" />
      <circle cx={CENTER} cy={CENTER} r="6" fill="rgb(var(--text))" />
      <text x={CENTER} y={CENTER + 4} dy="1.1em" textAnchor="middle" className="fill-text font-heading text-[15px] font-extrabold">
        {formatMoney(Math.abs(remaining), currency, { compact: true })}
      </text>
      <text x={CENTER} y={CENTER + 4} dy="2.7em" textAnchor="middle" className="fill-muted text-[8px] font-semibold">
        {remaining >= 0 ? 'left' : 'over budget'}
      </text>
    </svg>
  )
}
