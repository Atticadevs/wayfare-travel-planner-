import { useRef, useState } from 'react'
import { itineraryCategories, itineraryStatuses, toOptions } from '../../lib/categories'
import { useFocusFirstError } from '../../hooks/useFormFocus'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const FORM_ID = 'itinerary-form'
const categoryOptions = toOptions(itineraryCategories)
const statusOptions = toOptions(itineraryStatuses)

function Body({ item, defaultDate, trip, onSubmit }) {
  const [values, setValues] = useState({
    title: item?.title ?? '',
    place: item?.place ?? '',
    date: item?.date ?? defaultDate ?? trip.startDate,
    time: item?.time ?? '',
    category: item?.category ?? 'sightseeing',
    status: item?.status ?? 'todo',
    notes: item?.notes ?? '',
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
    if (!values.title.trim()) found.title = 'What are you doing?'
    if (!values.date) found.date = 'Pick a day.'
    setErrors(found)
    if (Object.keys(found).length) {
      setAttempt((a) => a + 1)
      return
    }
    onSubmit({ ...values, title: values.title.trim(), place: values.place.trim() })
  }

  return (
    <form ref={form} id={FORM_ID} onSubmit={submit} noValidate className="space-y-4">
      <Input label="Title" placeholder="Visit Petronas Towers" data-autofocus {...bind('title')} />
      <Input label="Place" placeholder="Petronas Towers" {...bind('place')} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Day" type="date" min={trip.startDate} max={trip.endDate} {...bind('date')} />
        <Input label="Time" type="time" {...bind('time')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Category" options={categoryOptions} value={values.category} onChange={choose('category')} searchable={false} />
        <Select label="Status" options={statusOptions} value={values.status} onChange={choose('status')} searchable={false} />
      </div>
      <Textarea label="Notes" {...bind('notes')} />
    </form>
  )
}

export function ItineraryForm({ open, item, defaultDate, trip, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      title={item ? 'Edit itinerary item' : 'Add itinerary item'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            {item ? 'Save' : 'Add item'}
          </Button>
        </>
      }
    >
      <Body item={item} defaultDate={defaultDate} trip={trip} onSubmit={onSubmit} />
    </Modal>
  )
}
