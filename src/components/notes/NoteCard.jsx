import { motion } from 'framer-motion'
import { MapPin, Pencil, Pin, Trash2 } from 'lucide-react'
import { notePalette } from '../../lib/colors'
import { listItem } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'


/** Sticky-note card. Plain text; line breaks are preserved. */
export function NoteCard({ note, onTogglePin, onEdit, onDelete }) {
  return (
    <motion.article
      {...listItem}
      aria-label={note.title || 'Note'}
      className={cn('group mb-4 break-inside-avoid rounded-2xl p-4 shadow-card-themed', notePalette(note.id))}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          {note.title && <h3 className="text-sm font-bold">{note.title}</h3>}
          {note.placeName && (
            <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-0.5 text-xs font-semibold text-muted">
              <MapPin size={11} aria-hidden="true" /> {note.placeName}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon
          aria-pressed={note.pinned}
          aria-label={note.pinned ? `Unpin ${note.title || 'note'}` : `Pin ${note.title || 'note'}`}
          onClick={onTogglePin}
        >
          <Pin size={14} aria-hidden="true" className={cn(note.pinned && 'fill-current')} />
        </Button>
      </div>
      {note.body && <p className="whitespace-pre-line text-sm leading-relaxed">{note.body}</p>}
      <div className="mt-3 flex justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <Button variant="ghost" size="sm" icon aria-label={`Edit ${note.title || 'note'}`} onClick={onEdit}>
          <Pencil size={14} aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="sm" icon aria-label={`Delete ${note.title || 'note'}`} onClick={onDelete}>
          <Trash2 size={14} aria-hidden="true" />
        </Button>
      </div>
    </motion.article>
  )
}
