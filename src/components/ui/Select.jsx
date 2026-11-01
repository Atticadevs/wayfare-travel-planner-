import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Search } from 'lucide-react'
import { popover } from '../../lib/motion'
import { cn } from '../../lib/cn'

/**
 * Searchable single-select. `options` is [{ value, label, hint? }].
 * Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter selects, Esc closes.
 */
export function Select({ label, options, value, onChange, searchable = true, className }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const trigger = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q
      ? options.filter((o) => `${o.label} ${o.value} ${o.hint ?? ''}`.toLowerCase().includes(q))
      : options
  }, [options, query])

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const close = () => {
    setOpen(false)
    setQuery('')
    trigger.current?.focus()
  }

  const choose = (option) => {
    onChange(option.value)
    close()
  }

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)))
    setOpen(true)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) choose(filtered[active])
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      close()
    }
  }

  return (
    <div ref={root} className={cn('relative', className)}>
      {label && (
        <span id={`${id}-label`} className="mb-1.5 block text-xs font-semibold text-muted">
          {label}
        </span>
      )}
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? `${id}-label` : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault()
            openList()
          }
        }}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-control border border-border bg-surface px-3 text-sm text-text transition-colors hover:bg-surface-2"
      >
        <span className="truncate">{selected?.label ?? 'Select…'}</span>
        <ChevronDown size={16} aria-hidden="true" className={cn('shrink-0 text-muted transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            {...popover}
            onKeyDown={onKeyDown}
            className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-control border border-border bg-surface shadow-lift"
          >
            {searchable && (
              <div className="flex items-center gap-2 border-b border-border px-3">
                <Search size={14} aria-hidden="true" className="text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActive(0)
                  }}
                  aria-label="Search options"
                  placeholder="Search…"
                  className="h-10 w-full bg-transparent text-sm placeholder:text-muted/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}
            <ul role="listbox" aria-labelledby={label ? `${id}-label` : undefined} className="max-h-60 overflow-auto p-1">
              {filtered.length === 0 && <li className="px-3 py-2 text-sm text-muted">No matches</li>}
              {filtered.map((o, i) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm',
                    i === active && 'bg-primary/10',
                  )}
                >
                  <span className="truncate">
                    {o.label}
                    {o.hint && <span className="ml-2 text-xs text-muted">{o.hint}</span>}
                  </span>
                  {o.value === value && <Check size={14} aria-hidden="true" className="text-primary" />}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
