import { useEffect } from 'react'

/** Sets the browser tab title, e.g. "Budget · Wayfare". */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Wayfare` : 'Wayfare — Travel Planner'
  }, [title])
}
