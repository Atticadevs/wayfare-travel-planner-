import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

const PHRASE = 'RESET'

function Body({ value, onChange }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        This permanently deletes all trips, bookings, itineraries, expenses, packing lists, notes and settings from this device. Export a backup first if you might need them.
      </p>
      <Input label={`Type ${PHRASE} to confirm`} value={value} onChange={(e) => onChange(e.target.value)} autoComplete="off" data-autofocus />
    </div>
  )
}

/** Type-to-confirm dialog for wiping all data. */
export function ResetDialog({ open, onConfirm, onCancel }) {
  const [value, setValue] = useState('')
  const ready = value.trim() === PHRASE
  const close = () => {
    setValue('')
    onCancel()
  }
  return (
    <Modal
      open={open}
      title="Reset all data?"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={!ready}
            onClick={() => {
              setValue('')
              onConfirm()
            }}
          >
            Reset everything
          </Button>
        </>
      }
    >
      <Body value={value} onChange={setValue} />
    </Modal>
  )
}
