import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { navItems } from '../../lib/nav'
import { spring } from '../../lib/motion'
import { cn } from '../../lib/cn'

export function MobileTabBar() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="flex">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center gap-0.5 py-2 text-xs font-semibold transition-colors',
                  isActive ? 'text-primary' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="mobile-tab-pill"
                      transition={spring}
                      className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary"
                    />
                  )}
                  <Icon size={20} aria-hidden="true" />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
