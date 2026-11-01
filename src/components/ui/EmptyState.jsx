import { motion } from 'framer-motion'
import { fadeUp } from '../../lib/motion'

export function EmptyState({ icon: Icon, title, message, children }) {
  return (
    <motion.div {...fadeUp} className="flex flex-col items-center px-6 py-12 text-center">
      {Icon && (
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue text-primary">
          <Icon size={28} aria-hidden="true" />
        </div>
      )}
      <h3 className="text-xl font-bold">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </motion.div>
  )
}
