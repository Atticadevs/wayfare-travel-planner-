import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../lib/cn'

/** Widget wrapper: title, subtitle, optional action, skeleton while loading, message when empty. */
export function ChartCard({ title, subtitle, action, loading = false, empty, className, children }) {
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {loading ? (
        <Skeleton className="min-h-32 flex-1" />
      ) : empty ? (
        <p className="grid flex-1 place-items-center rounded-control bg-surface-2 px-4 py-8 text-center text-sm text-muted">{empty}</p>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </Card>
  )
}
