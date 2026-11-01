import { Construction } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function CalendarPage() {
  return (
    <PageShell title="Calendar" subtitle="Trips, bookings and plans by day">
      <Card>
        <EmptyState icon={Construction} title="Coming in phase 7" message="This page is scaffolded and routed; its content is built in a later phase." />
      </Card>
    </PageShell>
  )
}
