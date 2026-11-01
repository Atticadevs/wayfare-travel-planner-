import { useRef, useState } from 'react'
import { Download, RotateCcw, Sparkles, Upload } from 'lucide-react'
import { downloadJSON } from '../../lib/download'
import { toISODate } from '../../lib/dates'
import { buildSnapshot, validateSnapshot } from '../../lib/snapshot'
import { toast } from '../../store/useToastStore'
import { useTripStore } from '../../store/useTripStore'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { ResetDialog } from './ResetDialog'

/** Export, import, demo data and reset. Destructive actions always confirm first. */
export function DataPanel() {
  const fileInput = useRef(null)
  const [pending, setPending] = useState(null) // validated import awaiting confirmation
  const [importError, setImportError] = useState('')
  const [confirmDemo, setConfirmDemo] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const hasData = useTripStore((s) => s.trips.length > 0)

  const exportData = () => {
    downloadJSON(`wayfare-backup-${toISODate(new Date())}.json`, buildSnapshot(useTripStore.getState()))
    toast('Backup downloaded')
  }

  const chooseFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImportError('')
    let parsed
    try {
      parsed = JSON.parse(await file.text())
    } catch {
      setImportError('That file is not valid JSON.')
      return
    }
    const result = validateSnapshot(parsed)
    if (result.ok) setPending(result)
    else setImportError(result.error)
  }

  const applyImport = () => {
    useTripStore.getState().replaceAll(pending.snapshot)
    setPending(null)
    toast('Data imported')
  }

  const loadDemo = () => {
    useTripStore.getState().loadDemoData()
    setConfirmDemo(false)
    toast('Demo data loaded')
  }

  const reset = () => {
    useTripStore.getState().resetAll()
    setConfirmReset(false)
    toast('All data cleared')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={exportData}>
          <Download size={16} aria-hidden="true" /> Export data
        </Button>
        <Button variant="secondary" onClick={() => fileInput.current.click()}>
          <Upload size={16} aria-hidden="true" /> Import data
        </Button>
        <input ref={fileInput} type="file" accept="application/json,.json" onChange={chooseFile} className="sr-only" tabIndex={-1} aria-hidden="true" />
        <Button variant="secondary" onClick={() => (hasData ? setConfirmDemo(true) : loadDemo())}>
          <Sparkles size={16} aria-hidden="true" /> Load demo data
        </Button>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          <RotateCcw size={16} aria-hidden="true" /> Reset all
        </Button>
      </div>
      {importError && (
        <p role="alert" className="text-sm text-danger-fg">
          {importError}
        </p>
      )}
      <p className="text-xs text-muted">Everything is stored on this device only. Export a JSON backup to move it elsewhere.</p>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Replace your data?"
        message={
          pending
            ? `This file has ${pending.counts.trips} trips, ${pending.counts.bookings} bookings, ${pending.counts.itinerary} itinerary items, ${pending.counts.expenses} expenses, ${pending.counts.packing} packing items and ${pending.counts.notes} notes. Importing replaces everything currently on this device.`
            : ''
        }
        confirmLabel="Replace my data"
        destructive
        onConfirm={applyImport}
        onCancel={() => setPending(null)}
      />
      <ConfirmDialog
        open={confirmDemo}
        title="Load demo data?"
        message="This replaces your current trips and everything attached to them with sample data."
        confirmLabel="Replace with demo data"
        destructive
        onConfirm={loadDemo}
        onCancel={() => setConfirmDemo(false)}
      />
      <ResetDialog open={confirmReset} onConfirm={reset} onCancel={() => setConfirmReset(false)} />
    </div>
  )
}
