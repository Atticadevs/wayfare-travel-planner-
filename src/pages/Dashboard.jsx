import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CalendarClock, CircleCheck, Plus, Sparkles, Timer, Wallet } from 'lucide-react'
import { ChartCard } from '../components/charts/ChartCard'
import { StatusRing } from '../components/charts/StatusRing'
import { BudgetOverview } from '../components/dashboard/BudgetOverview'
import { ConverterWidget } from '../components/dashboard/ConverterWidget'
import { ItineraryProgress } from '../components/dashboard/ItineraryProgress'
import { MiniCalendar } from '../components/dashboard/MiniCalendar'
import { NextTripHero } from '../components/dashboard/NextTripHero'
import { PackingSnapshot } from '../components/dashboard/PackingSnapshot'
import { RecentNotes } from '../components/dashboard/RecentNotes'
import { StatCard } from '../components/dashboard/StatCard'
import { UpcomingTrips } from '../components/dashboard/UpcomingTrips'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useNow } from '../hooks/useNow'
import { useRates } from '../hooks/useRates'
import { formatMoney } from '../lib/format'
import { convert } from '../lib/money'
import { staggerContainer, staggerItem } from '../lib/motion'
import {
  countTripsByStatus, daysUntilTrip, getActiveBudgetTotal, getMonthlySeries, getNextTrip, getTripSpend, getTripStatus,
} from '../store/selectors'
import { useTripStore } from '../store/useTripStore'

function Illustration() {
  return (
    <svg viewBox="0 0 160 110" className="mb-2 w-48" aria-hidden="true">
      <circle cx="80" cy="60" r="44" fill="rgb(var(--blue))" />
      <path d="M30 78 Q60 40 90 62 T140 40" fill="none" stroke="rgb(var(--primary))" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      <path d="m120 30 20 8-8 4-3 9-4-9-9-4Z" fill="rgb(var(--accent))" transform="translate(-4 -10)" />
      <circle cx="30" cy="78" r="5" fill="rgb(var(--primary))" />
      <path d="M96 100c0-10 8-18 18-18s18 8 18 18Z" fill="rgb(var(--success))" opacity=".5" />
    </svg>
  )
}

function Widget({ className, children }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  useDocumentTitle('Dashboard')
  const now = useNow(60000)
  const rates = useRates()
  const settings = useTripStore((s) => s.settings)
  const trips = useTripStore((s) => s.trips)
  const bookings = useTripStore((s) => s.bookings)
  const itinerary = useTripStore((s) => s.itinerary)
  const expenses = useTripStore((s) => s.expenses)
  const packing = useTripStore((s) => s.packing)
  const notes = useTripStore((s) => s.notes)
  const loadDemoData = useTripStore((s) => s.loadDemoData)
  const base = settings.baseCurrency

  const data = useMemo(() => {
    const counts = countTripsByStatus(trips, now)
    const withStatus = trips.map((trip) => ({ trip, status: getTripStatus(trip, now) }))
    const active = withStatus.filter(({ status }) => status === 'upcoming' || status === 'ongoing').sort((a, b) => a.trip.startDate.localeCompare(b.trip.startDate))
    const next = getNextTrip(trips, now)
    const nextStatus = next ? getTripStatus(next, now) : null
    const spentOf = (trip) => convert(getTripSpend(trip, bookings, expenses, rates).total, trip.budget.currency, base, rates)
    const future = [0, 1, 2, 3, 4, 5]
    return {
      counts,
      active,
      next,
      nextStatus,
      nextSpent: next ? getTripSpend(next, bookings, expenses, rates).total : 0,
      planned: getActiveBudgetTotal(trips, base, rates, now),
      activeSpent: active.reduce((sum, { trip }) => sum + spentOf(trip), 0),
      upcomingSeries: getMonthlySeries(trips, future, now, (_, s) => (s === 'upcoming' || s === 'ongoing' ? 1 : 0)),
      budgetSeries: getMonthlySeries(trips, future, now, (t, s) => (s === 'upcoming' || s === 'ongoing' ? convert(t.budget.amount, t.budget.currency, base, rates) : 0)),
      completedSeries: getMonthlySeries(trips, [-5, -4, -3, -2, -1, 0], now, (_, s) => (s === 'completed' ? 1 : 0)),
      presets: [...new Set([...trips.map((t) => t.budget.currency), ...expenses.map((e) => e.currency)])].sort(),
    }
  }, [trips, bookings, expenses, rates, base, now])

  const { counts, next, nextStatus } = data
  const nextPacking = useMemo(() => (next ? packing.filter((p) => p.tripId === next.id) : []), [packing, next])
  const daysAway = next && nextStatus === 'upcoming' ? daysUntilTrip(next, now) : 0

  if (trips.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 pt-8 md:px-8">
        <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">
          Welcome, {settings.userName} <span aria-hidden="true">👋</span>
        </h1>
        <div className="rounded-card bg-surface shadow-card-themed">
          <EmptyState title="Plan your first trip" message="Add a trip to see countdowns, budgets and progress here, or load sample trips to explore.">
            <div className="flex w-full justify-center"><Illustration /></div>
            <Button onClick={() => navigate('/trips?add=1')}>
              <Plus size={16} aria-hidden="true" /> Plan your first trip
            </Button>
            <Button variant="secondary" onClick={loadDemoData}>
              <Sparkles size={16} aria-hidden="true" /> Load demo data
            </Button>
          </EmptyState>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-24 pt-6 md:px-8 md:pb-12 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">
            Welcome back, {settings.userName} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 text-sm text-muted">{format(now, 'EEEE, d MMMM yyyy')}</p>
        </div>
        <Link to="/trips?add=1">
          <Button>
            <Plus size={16} aria-hidden="true" /> New trip
          </Button>
        </Link>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12 lg:gap-6">
        <Widget className="md:col-span-3 lg:col-span-3">
          <StatCard label="Upcoming trips" value={counts.upcoming} icon={CalendarClock} tone="info" caption={`${counts.ongoing} ongoing`} series={data.upcomingSeries} />
        </Widget>
        <Widget className="md:col-span-3 lg:col-span-3">
          <StatCard
            label="Active budget"
            value={data.planned}
            format={(n) => formatMoney(n, base)}
            icon={Wallet}
            tone="accent"
            caption={`${data.active.length} active trip${data.active.length === 1 ? '' : 's'}`}
            series={data.budgetSeries}
          />
        </Widget>
        <Widget className="md:col-span-3 lg:col-span-3">
          <StatCard
            label="Days until next trip"
            value={daysAway}
            icon={Timer}
            tone="primary"
            caption={!next ? 'No trip planned' : nextStatus === 'ongoing' ? 'Happening now' : next.destination}
          />
        </Widget>
        <Widget className="md:col-span-3 lg:col-span-3">
          <StatCard label="Trips completed" value={counts.completed} icon={CircleCheck} tone="success" caption={`of ${counts.total} trips`} series={data.completedSeries} />
        </Widget>

        <Widget className="md:col-span-6 lg:col-span-8">
          {next ? (
            <NextTripHero trip={next} status={nextStatus} spent={data.nextSpent} />
          ) : (
            <ChartCard title="Next trip" empty="Nothing coming up. Plan your next adventure!" />
          )}
        </Widget>
        <Widget className="md:col-span-6 lg:col-span-4">
          <ChartCard title="Trip status" subtitle="Tap a label to filter trips">
            <StatusRing counts={counts} />
          </ChartCard>
        </Widget>

        <Widget className="md:col-span-6 lg:col-span-12">
          <UpcomingTrips trips={data.active} itinerary={itinerary} />
        </Widget>
        <Widget className="md:col-span-3 lg:col-span-6">
          <MiniCalendar trips={trips} bookings={bookings} itinerary={itinerary} />
        </Widget>
        <Widget className="md:col-span-3 lg:col-span-6">
          <ItineraryProgress itinerary={itinerary} now={now} />
        </Widget>

        <Widget className="md:col-span-3 lg:col-span-4">
          <ConverterWidget presets={data.presets} />
        </Widget>
        <Widget className="md:col-span-3 lg:col-span-4">
          <BudgetOverview planned={data.planned} spent={data.activeSpent} currency={base} tripCount={data.active.length} />
        </Widget>
        <Widget className="md:col-span-6 lg:col-span-4">
          <PackingSnapshot trip={next} items={nextPacking} />
        </Widget>

        <Widget className="md:col-span-6 lg:col-span-12">
          <RecentNotes notes={notes} trips={trips} />
        </Widget>
      </motion.div>
    </div>
  )
}
