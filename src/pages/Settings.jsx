import { Monitor, Moon, Sun } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Toggle } from '../components/ui/Toggle'
import { useTripStore } from '../store/useTripStore'

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function Settings() {
  const settings = useTripStore((s) => s.settings)
  const updateSettings = useTripStore((s) => s.updateSettings)

  return (
    <PageShell title="Settings" subtitle="Appearance and preferences">
      <div className="grid max-w-2xl gap-6">
        <Card className="space-y-5">
          <h2 className="text-xl font-bold">Profile</h2>
          <Input
            label="Your name"
            value={settings.userName}
            onChange={(e) => updateSettings({ userName: e.target.value })}
            hint="Used in the greeting and avatar."
          />
        </Card>
        <Card className="space-y-5">
          <h2 className="text-xl font-bold">Appearance</h2>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted">Theme</p>
            <SegmentedControl
              label="Theme"
              options={themeOptions}
              value={settings.theme}
              onChange={(theme) => updateSettings({ theme })}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Reduce motion</p>
              <p className="text-xs text-muted">Turns off movement animations; simple fades remain.</p>
            </div>
            <Toggle
              label="Reduce motion"
              checked={settings.reducedMotion}
              onChange={(reducedMotion) => updateSettings({ reducedMotion })}
            />
          </div>
        </Card>
      </div>
    </PageShell>
  )
}
