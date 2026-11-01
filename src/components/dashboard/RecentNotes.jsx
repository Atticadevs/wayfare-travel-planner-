import { Link } from 'react-router-dom'
import { MapPin, Pin } from 'lucide-react'
import { notePalette } from '../../lib/colors'
import { cn } from '../../lib/cn'
import { ChartCard } from '../charts/ChartCard'

const MAX = 4

/** Latest notes across trips, pinned first. */
export function RecentNotes({ notes, trips }) {
  const titles = Object.fromEntries(trips.map((t) => [t.id, t.title]))
  const recent = [...notes]
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, MAX)

  return (
    <ChartCard title="Recent notes" subtitle="Pinned and latest" empty={recent.length === 0 && 'Notes you jot down on trips will show up here.'}>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {recent.map((note) => (
          <li key={note.id}>
            <Link
              to={`/trips/${note.tripId}?tab=notes`}
              className={cn('block h-full rounded-2xl p-4 transition-transform hover:-translate-y-0.5', notePalette(note.id))}
            >
              <p className="flex items-center justify-between gap-2 text-sm font-bold">
                <span className="truncate">{note.title || 'Untitled note'}</span>
                {note.pinned && <Pin size={12} aria-label="Pinned" className="shrink-0 fill-current" />}
              </p>
              {note.placeName && (
                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-0.5 text-xs font-semibold text-muted">
                  <MapPin size={11} aria-hidden="true" /> {note.placeName}
                </p>
              )}
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed">{note.body}</p>
              <p className="mt-2 text-[11px] font-semibold text-muted">{titles[note.tripId]}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
