import { useRef, useState } from 'react'
import { currencies } from '../../data/rates'
import { expenseCategories, toOptions } from '../../lib/categories'
import { toISODate } from '../../lib/dates'
import { useFocusFirstError } from '../../hooks/useFormFocus'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'

const FORM_ID = 'expense-form'
const categoryOptions = toOptions(expenseCategories)
const currencyOptions = currencies.map((c) => ({ value: c.code, label: c.code, hint: c.name }))

function Body({ expense, trip, onSubmit }) {
  const [values, setValues] = useState({
    title: expense?.title ?? '',
    amount: expense ? String(expense.amount) : '',
    currency: expense?.currency ?? trip.budget.currency,
    category: expense?.category ?? 'food',
    date: expense?.date ?? toISODate(new Date()),
    note: expense?.note ?? '',
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
    if (!values.title.trim()) found.title = 'What was it for?'
    const amount = Number(values.amount)
    if (!values.amount || !Number.isFinite(amount) || amount <= 0) found.amount = 'Enter an amount greater than zero.'
    if (!values.date) found.date = 'Pick a date.'
    setErrors(found)
    if (Object.keys(found).length) {
      setAttempt((a) => a + 1)
      return
    }
    onSubmit({ ...values, title: values.title.trim(), amount })
  }

  return (
    <form ref={form} id={FORM_ID} onSubmit={submit} noValidate className="space-y-4">
      <Input label="Title" placeholder="Street food dinner" data-autofocus {...bind('title')} />
      <div className="grid grid-cols-[1fr_9rem] gap-3">
        <Input label="Amount" type="number" min="0" step="any" inputMode="decimal" {...bind('amount')} />
        <Select label="Currency" options={currencyOptions} value={values.currency} onChange={choose('currency')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Category" options={categoryOptions} value={values.category} onChange={choose('category')} searchable={false} />
        <Input label="Date" type="date" {...bind('date')} />
      </div>
      <Input label="Note" {...bind('note')} />
    </form>
  )
}

export function ExpenseForm({ open, expense, trip, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      title={expense ? 'Edit expense' : 'Add expense'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            {expense ? 'Save' : 'Add expense'}
          </Button>
        </>
      }
    >
      <Body expense={expense} trip={trip} onSubmit={onSubmit} />
    </Modal>
  )
}
