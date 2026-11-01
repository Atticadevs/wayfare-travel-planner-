import { initials } from '../../lib/format'
import { cn } from '../../lib/cn'

export function Avatar({ name, className }) {
  return (
    <span
      role="img"
      aria-label={`Avatar for ${name}`}
      className={cn(
        'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-heading text-sm font-bold text-on-accent',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
