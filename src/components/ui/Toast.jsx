import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toastItem } from '../../lib/motion'
import { useToastStore } from '../../store/useToastStore'
import { Button } from './Button'

function ToastItem({ toast }) {
  const dismiss = useToastStore((s) => s.dismiss)

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), toast.duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, dismiss])

  return (
    <motion.div
      layout
      {...toastItem}
      role="status"
      className="relative w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-control bg-text text-bg shadow-lift"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.actionLabel && (
          <Button
            variant="ghost"
            size="sm"
            className="text-accent hover:bg-bg/10"
            onClick={() => {
              toast.onAction?.()
              dismiss(toast.id)
            }}
          >
            {toast.actionLabel}
          </Button>
        )}
      </div>
      <motion.div
        aria-hidden="true"
        className="h-0.5 origin-left bg-accent"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  )
}

/** Mount once; renders toasts pushed through useToastStore / toast(). */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-20 right-4 z-[60] flex flex-col items-end gap-2 md:bottom-6 md:right-6 [&>*]:pointer-events-auto"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  )
}
