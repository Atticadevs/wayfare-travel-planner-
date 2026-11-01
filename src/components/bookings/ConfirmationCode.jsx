import { Copy } from 'lucide-react'
import { toast } from '../../store/useToastStore'

/** Click-to-copy confirmation code. */
export function ConfirmationCode({ code }) {
  if (!code) return null
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast(`Copied ${code}`)
    } catch {
      toast('Could not copy automatically. Select the code and copy it manually.')
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy confirmation code ${code}`}
      className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2 py-1 font-mono text-xs font-semibold tracking-wider transition-colors hover:bg-primary/10"
    >
      {code}
      <Copy size={12} aria-hidden="true" />
    </button>
  )
}
