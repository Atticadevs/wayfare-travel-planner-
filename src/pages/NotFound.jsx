import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <PageShell title="Page not found">
      <EmptyState icon={Compass} title="This route doesn't exist" message="Let's get you back on track.">
        <Link to="/">
          <Button>Back home</Button>
        </Link>
      </EmptyState>
    </PageShell>
  )
}
