import { useDocumentTitle } from '../../hooks/useDocumentTitle'

/** Consistent page header + content width. Every page renders inside one. */
export function PageShell({ title, subtitle, actions, children }) {
  useDocumentTitle(title)
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-12 pt-6 md:px-8 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
