import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { pageTransition } from '../../lib/motion'
import { Navbar } from './Navbar'
import { ErrorBoundary } from './ErrorBoundary'

/** Navbar stays mounted; only the page content transitions. */
export function AppLayout() {
  const { pathname } = useLocation()
  const main = useRef(null)
  const navigated = useRef(false)
  const firstRender = useRef(true)
  // useOutlet returns a snapshot element, so the exiting page keeps its own content.
  const outlet = useOutlet()

  useEffect(() => {
    if (firstRender.current) firstRender.current = false
    else navigated.current = true
  }, [pathname])

  // After navigating, focus the new page once it has entered so keyboard and screen-reader users start at the top.
  const focusOnEnter = (definition) => {
    if (navigated.current && definition?.opacity === 1) {
      navigated.current = false
      main.current?.focus({ preventScroll: true })
    }
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-control bg-primary px-4 py-2 font-heading text-sm font-semibold text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          id="main"
          ref={main}
          tabIndex={-1}
          className="outline-none focus-visible:ring-0"
          onAnimationComplete={focusOnEnter}
          {...pageTransition}
        >
          <ErrorBoundary resetKey={pathname}>{outlet}</ErrorBoundary>
        </motion.main>
      </AnimatePresence>
    </>
  )
}
