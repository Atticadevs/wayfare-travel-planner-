import { useState } from 'react'
import { clearAll, wasCorrupted } from '../../services/storage'
import { ConfirmDialog } from '../ui/ConfirmDialog'

/** Shown once when saved data could not be parsed at startup. */
export function CorruptionPrompt() {
  const [open, setOpen] = useState(wasCorrupted)
  const reset = () => {
    clearAll()
    setOpen(false)
  }
  return (
    <ConfirmDialog
      open={open}
      title="Saved data couldn't be read"
      message="Your stored Wayfare data looks damaged, so the app started empty. Clear it to start fresh, or keep it and export it from your browser storage first."
      confirmLabel="Clear and start fresh"
      cancelLabel="Keep for now"
      destructive
      onConfirm={reset}
      onCancel={() => setOpen(false)}
    />
  )
}
