import { cn } from '../../lib/cn'

const tones = {
  neutral: 'bg-surface-2 text-muted border border-border',
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/15 text-text',
  success: 'bg-success/15 text-success-fg',
  warning: 'bg-warning/20 text-warning-fg',
  danger: 'bg-danger/15 text-danger-fg',
  info: 'bg-info/15 text-info-fg',
}

/** Pill badge. Pass an `icon` so status is never conveyed by color alone. */
export function Chip({ tone = 'neutral', icon: Icon, className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    >
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  )
}
