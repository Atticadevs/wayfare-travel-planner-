import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Plane, Settings, X } from 'lucide-react'
import { navItems } from '../../lib/nav'
import { spring } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { useTripStore } from '../../store/useTripStore'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Tooltip } from '../ui/Tooltip'

export function Navbar() {
  const userName = useTripStore((s) => s.settings.userName)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the menu after navigating.
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8">
        <NavLink to="/" className="flex items-center gap-2.5 rounded-control" aria-label="Wayfare home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-on-primary">
            <Plane size={18} aria-hidden="true" />
          </span>
          <span className="font-heading text-lg font-extrabold">Wayfare</span>
        </NavLink>

        <nav aria-label="Main" className="hidden rounded-full border border-border bg-surface p-1 shadow-card-themed md:flex">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'relative rounded-full px-4 py-2 font-heading text-sm font-semibold transition-colors',
                  isActive ? 'text-on-primary' : 'text-muted hover:text-text',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={spring}
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                  )}
                  <span className="relative">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Tooltip content="Settings" side="bottom">
            <NavLink
              to="/settings"
              aria-label="Settings"
              className="grid h-10 w-10 place-items-center rounded-control text-text transition-colors hover:bg-primary/10"
            >
              <Settings size={18} aria-hidden="true" />
            </NavLink>
          </Tooltip>
          <Avatar name={userName} className="ml-1" />
          <Button
            variant="ghost"
            icon
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-border bg-bg px-4 py-2 md:hidden">
          <ul>
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-control px-3 py-3 font-heading text-sm font-semibold transition-colors',
                      isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-primary/5',
                    )
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
