import { forwardRef, useId } from 'react'
import { cn } from '../../lib/cn'

/** Labelled text input with inline error and hint. */
export const Input = forwardRef(function Input(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const auto = useId()
  const inputId = id ?? auto
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-10 w-full rounded-control border bg-surface px-3 text-sm text-text placeholder:text-muted/70 transition-colors focus:border-primary',
          error ? 'border-danger' : 'border-border',
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-danger-fg">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
