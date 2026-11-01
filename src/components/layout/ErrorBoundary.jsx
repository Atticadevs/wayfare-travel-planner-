import { Component } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

/** Catches render errors in a page so the navbar stays usable. Resets when `resetKey` changes. */
export class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidUpdate(prev) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="mx-auto max-w-[1400px] px-4 pt-8 md:px-8">
        <EmptyState icon={TriangleAlert} title="Something went wrong" message="This page hit an unexpected problem. Your data is safe on this device.">
          <Button onClick={() => this.setState({ failed: false })}>Try again</Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Reload app
          </Button>
        </EmptyState>
      </div>
    )
  }
}
