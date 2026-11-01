export const ease = [0.22, 1, 0.36, 1]
export const spring = { type: 'spring', stiffness: 260, damping: 24 }
export const duration = { fast: 0.2, base: 0.25, slow: 0.4 }

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease } },
}

export const pageTransition = fadeUp

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease } },
}

export const cardHover = { y: -3, transition: { duration: duration.fast, ease } }
export const cardTap = { scale: 0.98 }

export const listItem = {
  layout: true,
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: duration.base, ease } },
  exit: { opacity: 0, height: 0, transition: { duration: duration.fast, ease } },
}

export const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.base } },
  exit: { opacity: 0, transition: { duration: duration.fast } },
}

export const modalPanel = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: duration.base, ease } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: duration.fast, ease } },
}

export const drawerPanel = {
  right: {
    initial: { x: '100%' },
    animate: { x: 0, transition: spring },
    exit: { x: '100%', transition: { duration: duration.base, ease } },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0, transition: spring },
    exit: { y: '100%', transition: { duration: duration.base, ease } },
  },
}

export const toastItem = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: spring },
  exit: { opacity: 0, x: 40, transition: { duration: duration.fast, ease } },
}

export const popover = {
  initial: { opacity: 0, y: -4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: duration.fast, ease } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}

export const chartViewport = { once: true, amount: 0.3 }
