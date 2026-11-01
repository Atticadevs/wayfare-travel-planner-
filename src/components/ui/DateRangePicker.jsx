import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek,
} from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { parseDate, toISODate } from '../../lib/dates'
import { formatDateRange } from '../../lib/format'
import { popover } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { Button } from './Button'

const weekOptions = { weekStartsOn: 1 }

/**
 * Range picker. Click a start day, then an end day. `start` / `end` are ISO dates
 * (end is '' while the user is mid-selection). Calls onChange({ start, end }).
 */
export function DateRangePicker({ label, start, end, onChange, error }) {
  const id = useId()
  const root = useRef(null)
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => startOfMonth(start ? parseDate(start) : new Date()))
  const [hover, setHover] = useState(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const anchoring = Boolean(start) && !end
  const startDate = start ? parseDate(start) : null
  const endDate = end ? parseDate(end) : anchoring && hover && hover >= startDate ? hover : null

  const pick = (day) => {
    const iso = toISODate(day)
    if (!anchoring) {
      onChange({ start: iso, end: '' })
    } else if (iso < start) {
      onChange({ start: iso, end: '' })
    } else {
      onChange({ start, end: iso })
      setOpen(false)
    }
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), weekOptions),
    end: endOfWeek(endOfMonth(month), weekOptions),
  })

  const summary = start && end ? formatDateRange(start, end) : start ? 'Pick an end date…' : 'Select dates'

  return (
    <div
      ref={root}
      className="relative"
      data-escape-owner={open ? '' : undefined}
      onKeyDown={(e) => {
        if (open && e.key === 'Escape') setOpen(false)
      }}
    >
      {label && (
        <span id={`${id}-label`} className="mb-1.5 block text-xs font-semibold text-muted">
          {label}
        </span>
      )}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-control border bg-surface px-3 text-left text-sm transition-colors hover:bg-surface-2',
          error ? 'border-danger' : 'border-border',
          !start && 'text-muted',
        )}
      >
        <CalendarDays size={16} aria-hidden="true" className="text-muted" />
        {summary}
      </button>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger-fg">
          {error}
        </p>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            {...popover}
            role="dialog"
            aria-label="Choose dates"
            className="absolute left-0 z-30 mt-2 w-[19rem] rounded-card border border-border bg-surface p-4 shadow-lift"
          >
            <div className="mb-3 flex items-center justify-between">
              <Button variant="ghost" size="sm" icon aria-label="Previous month" onClick={() => setMonth((m) => addMonths(m, -1))}>
                <ChevronLeft size={16} aria-hidden="true" />
              </Button>
              <span className="font-heading text-sm font-bold" aria-live="polite">
                {format(month, 'MMMM yyyy')}
              </span>
              <Button variant="ghost" size="sm" icon aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))}>
                <ChevronRight size={16} aria-hidden="true" />
              </Button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted" aria-hidden="true">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className="py-1">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7" onMouseLeave={() => setHover(null)}>
              {days.map((day) => {
                const isStart = startDate && isSameDay(day, startDate)
                const isEnd = endDate && isSameDay(day, endDate)
                const inRange = startDate && endDate && day > startDate && day < endDate
                return (
                  <div key={day.toISOString()} className={cn('py-0.5', (inRange || (isStart && endDate)) && 'bg-primary/10', isEnd && startDate && 'bg-primary/10')}>
                    <button
                      type="button"
                      aria-label={format(day, 'EEEE, d MMMM yyyy')}
                      aria-pressed={Boolean(isStart || isEnd)}
                      onClick={() => pick(day)}
                      onMouseEnter={() => setHover(day)}
                      className={cn(
                        'mx-auto grid h-9 w-9 place-items-center rounded-full text-sm transition-colors',
                        !isSameMonth(day, month) && 'text-muted/50',
                        isStart || isEnd ? 'bg-primary font-bold text-on-primary' : 'hover:bg-primary/15',
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
