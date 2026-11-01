import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { pageTransition } from '../../lib/motion'
import { Navbar } from './Navbar'
import { MobileTabBar } from './MobileTabBar'

/** Navbar and tab bar stay mounted; only the page content transitions. */
export function AppLayout() {
  const { pathname } = useLocation()
  // useOutlet returns a snapshot element, so the exiting page keeps its own content.
  const outlet = useOutlet()
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main key={pathname} {...pageTransition}>
          {outlet}
        </motion.main>
      </AnimatePresence>
      <MobileTabBar />
    </>
  )
}
