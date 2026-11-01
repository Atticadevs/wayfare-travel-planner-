import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { backdrop, drawerPanel } from '../../lib/motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Button } from './Button'

function DrawerPanel({ title, onClose, children, footer }) {
  const ref = useRef(null)
  const titleId = useId()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const variants = drawerPanel[isDesktop ? 'right' : 'bottom']
  useFocusTrap(ref, { onEscape: onClose })
  return (
    <div className="fixed inset-0 z-50">
      <motion.div {...backdrop} onClick={onClose} className="absolute inset-0 bg-text/40 backdrop-blur-[2px]" aria-hidden="true" />
      <motion.aside
        {...variants}
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute bottom-0 right-0 flex max-h-[90vh] w-full flex-col rounded-t-card bg-surface shadow-lift dark:border dark:border-border md:inset-y-0 md:max-h-none md:w-[440px] md:rounded-l-card md:rounded-tr-none"
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <h2 id={titleId} className="text-xl font-bold">
            {title}
          </h2>
          <Button variant="ghost" size="sm" icon onClick={onClose} aria-label="Close panel">
            <X size={16} aria-hidden="true" />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</footer>}
      </motion.aside>
    </div>
  )
}

/** Right-side drawer on desktop, bottom sheet on mobile. */
export function Drawer({ open, ...props }) {
  return createPortal(<AnimatePresence>{open && <DrawerPanel {...props} />}</AnimatePresence>, document.body)
}
