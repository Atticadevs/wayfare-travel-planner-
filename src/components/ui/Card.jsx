import { motion } from 'framer-motion'
import { cardHover, cardTap } from '../../lib/motion'
import { cn } from '../../lib/cn'

/** Rounded widget card. `interactive` adds hover lift and press feedback. */
export function Card({ interactive = false, className, children, ...props }) {
  return (
    <motion.div
      whileHover={interactive ? cardHover : undefined}
      whileTap={interactive ? cardTap : undefined}
      className={cn(
        'rounded-card bg-surface p-5 shadow-card-themed transition-shadow',
        interactive && 'cursor-pointer hover:shadow-lift',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
