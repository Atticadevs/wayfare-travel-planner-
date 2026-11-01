import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { listItem } from '../../lib/motion'
import { useFocusFirstError } from '../../hooks/useFormFocus'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'

/** Inline editor that replaces a note card in the grid (also used for new notes). */
export function NoteEditor({ note, onSave, onCancel }) {
  const [values, setValues] = useState({ title: note?.title ?? '', placeName: note?.placeName ?? '', body: note?.body ?? '' })
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const form = useRef(null)
  useFocusFirstError(form, attempt)

  const submit = (e) => {
    e.preventDefault()
    if (!values.title.trim() && !values.body.trim()) {
      setError('Write a title or a few words first.')
      setAttempt((a) => a + 1)
      return
    }
    onSave({ title: values.title.trim(), placeName: values.placeName.trim(), body: values.body })
  }

  return (
    <motion.form
      ref={form}
      onSubmit={submit}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      noValidate
      {...listItem}
      className="mb-4 break-inside-avoid space-y-3 rounded-card border-2 border-primary/40 bg-surface p-4 shadow-card-themed"
    >
      <Input aria-label="Note title" placeholder="Title" data-autofocus autoFocus value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} />
      <Input aria-label="Place name" placeholder="Place (optional), e.g. Central Market" value={values.placeName} onChange={(e) => setValues((v) => ({ ...v, placeName: e.target.value }))} />
      <Textarea
        aria-label="Note"
        placeholder="Jot something down…"
        rows={4}
        value={values.body}
        error={error}
        onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={14} aria-hidden="true" /> Cancel
        </Button>
        <Button type="submit" size="sm">
          <Check size={14} aria-hidden="true" /> Save
        </Button>
      </div>
    </motion.form>
  )
}
