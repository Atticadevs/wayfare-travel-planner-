import { useEffect } from 'react'

/** After a failed submit (attempt increments), focus the first invalid field in formRef. */
export function useFocusFirstError(formRef, attempt) {
  useEffect(() => {
    if (attempt > 0) formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
  }, [attempt, formRef])
}
