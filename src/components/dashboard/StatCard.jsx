import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../lib/cn'
import { Sparkline } from '../charts/Sparkline'
import { Card } from '../ui/Card'

const chipTones = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/20 text-text',
  success: 'bg-success/15 text-success-fg',
  info: 'bg-info/15 text-info-fg',
}

/** Headline number with icon chip, count-up, sparkline and a short caption. */
export function StatCard({ label, value, format = (n) => String(Math.round(n)), icon: Icon, tone = 'primary', caption, series }) {
  const animated = useCountUp(value)
  return (
    <Card className="flex flex-col gap-3 !p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span className={cn('grid h-9 w-9 place-items-center rounded-xl', chipTones[tone])}>
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="font-heading text-3xl font-extrabold leading-none tabular-nums" aria-label={`${label}: ${format(value)}`}>
        <span aria-hidden="true">{format(animated)}</span>
      </p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-xs text-muted">{caption}</p>
        {series && (
          <div className="w-20 shrink-0">
            <Sparkline data={series} tone={tone === 'accent' ? 'accent' : tone} label={`${label} trend`} />
          </div>
        )}
      </div>
    </Card>
  )
}
