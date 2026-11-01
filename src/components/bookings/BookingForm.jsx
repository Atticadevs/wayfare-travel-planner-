import { useRef, useState } from 'react'
import { currencies } from '../../data/rates'
import { bookingStatuses, bookingTypes, toOptions } from '../../lib/categories'
import { useFocusFirstError } from '../../hooks/useFormFocus'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const FORM_ID = 'booking-form'
const typeOptions = toOptions(bookingTypes)
const statusOptions = toOptions(bookingStatuses)
const currencyOptions = currencies.map((c) => ({ value: c.code, label: c.code, hint: c.name }))

function Body({ booking, trip, onSubmit }) {
  const [values, setValues] = useState({
    type: booking?.type ?? 'flight',
    title: booking?.title ?? '',
    provider: booking?.provider ?? '',
    confirmationCode: booking?.confirmationCode ?? '',
    startDateTime: booking?.startDateTime ?? `${trip.startDate}T09:00`,
    endDateTime: booking?.endDateTime ?? `${trip.startDate}T12:00`,
    from: booking?.from ?? '',
    to: booking?.to ?? '',
    amount: booking ? String(booking.cost.amount) : '',
    currency: booking?.cost.currency ?? trip.budget.currency,
    status: booking?.status ?? 'confirmed',
    notes: booking?.notes ?? '',
  })
  const [errors, setErrors] = useState({})
  const [attempt, setAttempt] = useState(0)
  const form = useRef(null)
  useFocusFirstError(form, attempt)

  const bind = (field) => ({ value: values[field], onChange: (e) => setValues((v) => ({ ...v, [field]: e.target.value })), error: errors[field] })
  const choose = (field) => (value) => setValues((v) => ({ ...v, [field]: value }))

  const submit = (e) => {
    e.preventDefault()
    const found = {}
    if (!values.title.trim()) found.title = 'Give this booking a title.'
    if (!values.startDateTime) found.startDateTime = 'Add a start time.'
    if (!values.endDateTime) found.endDateTime = 'Add an end time.'
    else if (values.startDateTime && values.endDateTime < values.startDateTime) found.endDateTime = 'The end can’t be before the start.'
    const amount = Number(values.amount || 0)
    if (!Number.isFinite(amount) || amount < 0) found.amount = 'Enter a cost of zero or more.'
    setErrors(found)
    if (Object.keys(found).length) {
      setAttempt((a) => a + 1)
      return
    }
    const data = { ...values, title: values.title.trim(), cost: { amount, currency: values.currency } }
    delete data.amount
    delete data.currency
    onSubmit(data)
  }

  const transport = bookingTypes[values.type].transport

  return (
    <form ref={form} id={FORM_ID} onSubmit={submit} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Type" options={typeOptions} value={values.type} onChange={choose('type')} searchable={false} />
        <Select label="Status" options={statusOptions} value={values.status} onChange={choose('status')} searchable={false} />
      </div>
      <Input label="Title" placeholder="Lahore → Kuala Lumpur" data-autofocus {...bind('title')} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Provider" placeholder="Malaysia Airlines" {...bind('provider')} />
        <Input label="Confirmation code" placeholder="MH2P7Q" {...bind('confirmationCode')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label={values.type === 'hotel' ? 'Check-in' : 'Starts'} type="datetime-local" {...bind('startDateTime')} />
        <Input label={values.type === 'hotel' ? 'Check-out' : 'Ends'} type="datetime-local" {...bind('endDateTime')} />
      </div>
      {transport && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="From" placeholder="LHE" {...bind('from')} />
          <Input label="To" placeholder="KUL" {...bind('to')} />
        </div>
      )}
      <div className="grid grid-cols-[1fr_9rem] gap-3">
        <Input label="Cost" type="number" min="0" step="any" inputMode="decimal" {...bind('amount')} />
        <Select label="Currency" options={currencyOptions} value={values.currency} onChange={choose('currency')} />
      </div>
      <Textarea label="Notes" {...bind('notes')} />
    </form>
  )
}

export function BookingForm({ open, booking, trip, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      size="lg"
      title={booking ? 'Edit booking' : 'Add booking'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            {booking ? 'Save' : 'Add booking'}
          </Button>
        </>
      }
    >
      <Body booking={booking} trip={trip} onSubmit={onSubmit} />
    </Modal>
  )
}
