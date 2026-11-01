import { Link } from 'react-router-dom'
import { ProgressRing } from '../charts/ProgressRing'
import { ChartCard } from '../charts/ChartCard'
import { getPackingProgress } from '../../store/selectors'

/** Packing progress for the next trip. */
export function PackingSnapshot({ trip, items }) {
  const progress = getPackingProgress(items)
  return (
    <ChartCard
      title="Packing"
      subtitle={trip ? trip.title : undefined}
      empty={(!trip || items.length === 0) && 'Start a packing list for your next trip.'}
    >
      {trip && (
        <div className="flex flex-col items-center gap-3 text-center">
          <ProgressRing value={progress.pct} size={88} stroke={10} tone={progress.pct === 100 ? 'success' : 'accent'} label="Packing progress" />
          <p className="text-sm font-semibold">
            {progress.packed} of {progress.total} packed
          </p>
          <Link to={`/trips/${trip.id}?tab=packing`} className="text-xs font-semibold text-primary hover:underline">
            Open checklist
          </Link>
        </div>
      )}
    </ChartCard>
  )
}
