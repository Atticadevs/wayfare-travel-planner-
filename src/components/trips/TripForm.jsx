import { useEffect, useRef, useState } from 'react'
import { Check, ImagePlus, Plus } from 'lucide-react'
import { currencies } from '../../data/rates'
import { coverBackground, coverGradients } from '../../lib/colors'
import { compressImage } from '../../lib/image'
import { validateTrip } from '../../lib/validation'
import { cn } from '../../lib/cn'
import { useTripStore } from '../../store/useTripStore'
import { Button } from '../ui/Button'
import { DateRangePicker } from '../ui/DateRangePicker'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

export const TRIP_FORM_ID = 'trip-form'

const suggestedTags = ['Food', 'Culture', 'Adventure', 'Beach', 'City', 'Nature', 'History', 'Family', 'Luxury', 'Wellness']
const currencyOptions = currencies.map((c) => ({ value: c.code, label: c.code, hint: c.name }))

function initialValues(trip, baseCurrency) {
  return {
    title: trip?.title ?? '',
    destination: trip?.destination ?? '',
    country: trip?.country ?? '',
    countryCode: trip?.countryCode ?? '',
    startDate: trip?.startDate ?? '',
    endDate: trip?.endDate ?? '',
    budgetAmount: trip ? String(trip.budget.amount) : '',
    budgetCurrency: trip?.budget.currency ?? baseCurrency,
    travelers: String(trip?.travelers ?? 1),
    tags: trip?.tags ?? [],
    coverImage: trip?.coverImage ?? 'ocean',
  }
}

function Section({ title, children }) {
  return (
    <fieldset className="mb-6 space-y-4">
      <legend className="mb-3 font-heading text-xs font-bold uppercase tracking-wide text-muted">{title}</legend>
      {children}
    </fieldset>
  )
}

/** Create / edit form. Render inside a Drawer and submit with `form={TRIP_FORM_ID}`. */
export function TripForm({ trip, onSubmit }) {
  const baseCurrency = useTripStore((s) => s.settings.baseCurrency)
  const [values, setValues] = useState(() => initialValues(trip, baseCurrency))
  const [errors, setErrors] = useState({})
  const [attempt, setAttempt] = useState(0)
  const [customTag, setCustomTag] = useState('')
  const [coverError, setCoverError] = useState('')
  const form = useRef(null)
  const fileInput = useRef(null)

  const set = (field) => (value) => setValues((v) => ({ ...v, [field]: value }))
  const bind = (field) => ({
    value: values[field],
    error: errors[field],
    onChange: (e) => set(field)(e.target.value),
  })

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    if (attempt > 0) form.current?.querySelector('[aria-invalid="true"]')?.focus()
  }, [attempt])

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validateTrip(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setAttempt((a) => a + 1)
      return
    }
    onSubmit({
      title: values.title.trim(),
      destination: values.destination.trim(),
      country: values.country.trim(),
      countryCode: values.countryCode.toUpperCase(),
      coverImage: values.coverImage,
      startDate: values.startDate,
      endDate: values.endDate,
      travelers: Number(values.travelers),
      budget: { amount: Number(values.budgetAmount), currency: values.budgetCurrency },
      tags: values.tags,
    })
  }

  const toggleTag = (tag) =>
    set('tags')(values.tags.includes(tag) ? values.tags.filter((t) => t !== tag) : [...values.tags, tag])

  const addCustomTag = () => {
    const tag = customTag.trim()
    if (tag && !values.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) set('tags')([...values.tags, tag])
    setCustomTag('')
  }

  const upload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      set('coverImage')(await compressImage(file))
      setCoverError('')
    } catch (err) {
      setCoverError(err.message)
    }
  }

  const isUpload = values.coverImage.startsWith('data:')
  const allTags = [...new Set([...suggestedTags, ...values.tags])]

  return (
    <form ref={form} id={TRIP_FORM_ID} onSubmit={handleSubmit} noValidate>
      <Section title="Basics">
        <Input label="Trip title" placeholder="Summer in Kuala Lumpur" {...bind('title')} data-autofocus />
        <Input label="Destination" placeholder="Kuala Lumpur" {...bind('destination')} />
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <Input label="Country" placeholder="Malaysia" {...bind('country')} />
          <Input label="Code" placeholder="MY" maxLength={2} {...bind('countryCode')} />
        </div>
      </Section>

      <Section title="Dates">
        <DateRangePicker
          label="Travel dates"
          start={values.startDate}
          end={values.endDate}
          error={errors.dates}
          onChange={({ start, end }) => setValues((v) => ({ ...v, startDate: start, endDate: end }))}
        />
      </Section>

      <Section title="Budget & travelers">
        <div className="grid grid-cols-[1fr_9rem] gap-3">
          <Input label="Budget" type="number" min="0" step="any" inputMode="decimal" placeholder="1500" {...bind('budgetAmount')} />
          <Select label="Currency" options={currencyOptions} value={values.budgetCurrency} onChange={set('budgetCurrency')} />
        </div>
        <Input label="Travelers" type="number" min="1" step="1" inputMode="numeric" {...bind('travelers')} />
      </Section>

      <Section title="Tags">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const on = values.tags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                  on ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted hover:text-text',
                )}
              >
                {on && <Check size={12} aria-hidden="true" />}
                {tag}
              </button>
            )
          })}
        </div>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            aria-label="Custom tag"
            placeholder="Add your own"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustomTag()
              }
            }}
          />
          <Button variant="secondary" icon onClick={addCustomTag} aria-label="Add tag">
            <Plus size={16} aria-hidden="true" />
          </Button>
        </div>
      </Section>

      <Section title="Cover">
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(coverGradients).map((key) => {
            const on = values.coverImage === key
            return (
              <button
                key={key}
                type="button"
                aria-label={`${key} cover`}
                aria-pressed={on}
                onClick={() => set('coverImage')(key)}
                style={{ background: coverGradients[key] }}
                className={cn('grid h-12 place-items-center rounded-control text-white transition-transform', on && 'ring-2 ring-primary ring-offset-2 ring-offset-surface')}
              >
                {on && <Check size={16} aria-hidden="true" />}
              </button>
            )
          })}
        </div>
        <input ref={fileInput} type="file" accept="image/*" onChange={upload} className="sr-only" tabIndex={-1} aria-hidden="true" />
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => fileInput.current.click()}>
            <ImagePlus size={16} aria-hidden="true" /> Upload image
          </Button>
          {isUpload && (
            <span
              role="img"
              aria-label="Uploaded cover preview"
              className="h-10 w-16 rounded-lg border border-border"
              style={{ background: coverBackground(values.coverImage) }}
            />
          )}
        </div>
        {coverError ? (
          <p role="alert" className="text-xs text-danger-fg">
            {coverError}
          </p>
        ) : (
          <p className="text-xs text-muted">Images are resized and kept under 300KB, stored on this device only.</p>
        )}
      </Section>
    </form>
  )
}
