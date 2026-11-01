import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { popover } from '../../lib/motion'
import { cn } from '../../lib/cn'

/** Wraps a single focusable child; shows `content` on hover and keyboard focus. */
export function Tooltip({ content, side = 'top', children }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <span className={cn('pointer-events-none absolute left-1/2 z-40 -translate-x-1/2', side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2')}>
            <motion.span
              {...popover}
              id={id}
              role="tooltip"
              className="block whitespace-nowrap rounded-lg bg-text px-2.5 py-1.5 text-xs font-medium text-bg shadow-lift"
            >
              {content}
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </span>
  )
}
