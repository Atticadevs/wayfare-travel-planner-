import { Construction } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function BudgetPage() {
  return (
    <PageShell title="Budget" subtitle="Planned vs spent across trips">
      <Card>
        <EmptyState icon={Construction} title="Coming in phase 6" message="This page is scaffolded and routed; its content is built in a later phase." />
      </Card>
    </PageShell>
  )
}
