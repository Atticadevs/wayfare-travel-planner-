import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus, Search, StickyNote } from 'lucide-react'
import { useAutoAdd } from '../../hooks/useAutoAdd'
import { toast } from '../../store/useToastStore'
import { useTripStore } from '../../store/useTripStore'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { NoteCard } from './NoteCard'
import { NoteEditor } from './NoteEditor'

/** Notes tab: searchable masonry-style grid of sticky notes with inline editing. */
export function NoteList({ trip, notes }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // note id, 'new', or null
  const { addNote, updateNote, deleteNote, restore } = useTripStore.getState()
  useAutoAdd(() => setEditing('new'))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes
      .filter((n) => !q || `${n.title} ${n.placeName} ${n.body}`.toLowerCase().includes(q))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt))
  }, [notes, query])

  const save = (values) => {
    if (editing === 'new') {
      addNote({ ...values, tripId: trip.id, pinned: false })
      toast('Note added')
    } else {
      updateNote(editing, values)
      toast('Note saved')
    }
    setEditing(null)
  }

  const remove = (note) => {
    deleteNote(note.id)
    toast('Note deleted', { actionLabel: 'Undo', onAction: () => restore('notes', note) })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[12rem] flex-1 md:max-w-sm">
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            aria-label="Search notes"
            placeholder="Search notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-control border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted/70 focus:border-primary"
          />
        </div>
        <Button className="ml-auto" size="sm" onClick={() => setEditing('new')}>
          <Plus size={14} aria-hidden="true" /> Add note
        </Button>
      </div>

      {notes.length === 0 && editing !== 'new' ? (
        <EmptyState icon={StickyNote} title="No notes yet" message="Capture tips, addresses and ideas, optionally tagged to a place.">
          <Button onClick={() => setEditing('new')}>
            <Plus size={16} aria-hidden="true" /> Add note
          </Button>
        </EmptyState>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          <AnimatePresence initial={false}>
            {editing === 'new' && <NoteEditor key="new" onSave={save} onCancel={() => setEditing(null)} />}
            {visible.map((note) =>
              editing === note.id ? (
                <NoteEditor key={note.id} note={note} onSave={save} onCancel={() => setEditing(null)} />
              ) : (
                <NoteCard
                  key={note.id}
                  note={note}
                  onTogglePin={() => updateNote(note.id, { pinned: !note.pinned })}
                  onEdit={() => setEditing(note.id)}
                  onDelete={() => remove(note)}
                />
              ),
            )}
          </AnimatePresence>
          {notes.length > 0 && visible.length === 0 && <p className="text-sm text-muted">No notes match “{query}”.</p>}
        </div>
      )}
    </div>
  )
}
