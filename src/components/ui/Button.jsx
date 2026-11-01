import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const variants = {
  primary: 'bg-primary text-on-primary hover:brightness-110 shadow-sm',
  accent: 'bg-accent text-on-accent hover:brightness-105 shadow-sm',
  secondary: 'bg-surface text-text border border-border hover:bg-surface-2',
  ghost: 'bg-transparent text-text hover:bg-primary/10',
  danger: 'bg-danger/10 text-danger-fg hover:bg-danger/20',
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

const iconSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }

/** Icon-only buttons (`icon`) must pass an `aria-label`. */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', icon = false, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-control font-heading font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        icon ? iconSizes[size] : sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
})
