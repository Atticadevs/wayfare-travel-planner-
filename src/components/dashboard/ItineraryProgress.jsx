import { useMemo } from 'react'
import { getMonthlyItineraryCompletion } from '../../store/selectors'
import { MonthlyBars } from '../charts/MonthlyBars'
import { ChartCard } from '../charts/ChartCard'

/** Per-month itinerary completion for the current year. */
export function ItineraryProgress({ itinerary, now }) {
  const year = now.getFullYear()
  const data = useMemo(() => getMonthlyItineraryCompletion(itinerary, year), [itinerary, year])
  const empty = data.every((d) => d.total === 0)

  return (
    <ChartCard title="Itinerary progress" subtitle={`Completion by month, ${year}`} empty={empty && 'Add itinerary items to see your progress.'}>
      <MonthlyBars data={data} currentMonth={now.getMonth()} year={year} />
    </ChartCard>
  )
}
