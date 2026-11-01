import { Construction } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function Dashboard() {
  return (
    <PageShell title="Dashboard" subtitle="Your trips at a glance">
      <Card>
        <EmptyState icon={Construction} title="Coming in phase 5" message="This page is scaffolded and routed; its content is built in a later phase." />
      </Card>
    </PageShell>
  )
}
