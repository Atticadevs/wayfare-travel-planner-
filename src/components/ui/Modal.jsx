import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { backdrop, modalPanel } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { Button } from './Button'

function ModalPanel({ title, onClose, children, footer, size = 'md' }) {
  const ref = useRef(null)
  const titleId = useId()
  useFocusTrap(ref, { onEscape: onClose })
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <motion.div {...backdrop} onClick={onClose} className="absolute inset-0 bg-text/40 backdrop-blur-[2px]" aria-hidden="true" />
      <motion.div
        {...modalPanel}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative max-h-[90vh] w-full overflow-y-auto rounded-card bg-surface p-6 shadow-lift dark:border dark:border-border',
          size === 'lg' ? 'max-w-xl' : 'max-w-md',
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold">
            {title}
          </h2>
          <Button variant="ghost" size="sm" icon onClick={onClose} aria-label="Close dialog">
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </motion.div>
    </div>
  )
}

/** Centered dialog. Esc and outside click close it; focus is trapped while open. size: 'md' | 'lg'. */
export function Modal({ open, ...props }) {
  return createPortal(<AnimatePresence>{open && <ModalPanel {...props} />}</AnimatePresence>, document.body)
}
