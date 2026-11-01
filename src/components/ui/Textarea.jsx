import { forwardRef, useId } from 'react'
import { cn } from '../../lib/cn'

export const Textarea = forwardRef(function Textarea({ label, error, className, id, rows = 3, ...props }, ref) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <div className={className}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-xs font-semibold text-muted">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(
          'w-full resize-y rounded-control border bg-surface px-3 py-2 text-sm placeholder:text-muted/70 transition-colors focus:border-primary',
          error ? 'border-danger' : 'border-border',
        )}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="mt-1 text-xs text-danger-fg">
          {error}
        </p>
      )}
    </div>
  )
})
