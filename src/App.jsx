import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { CorruptionPrompt } from './components/layout/CorruptionPrompt'
import { Skeleton } from './components/ui/Skeleton'
import { ToastViewport } from './components/ui/Toast'
import { useThemeSync } from './hooks/useTheme'
import { useTripStore } from './store/useTripStore'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Trips = lazy(() => import('./pages/Trips'))
const TripDetail = lazy(() => import('./pages/TripDetail'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const BudgetPage = lazy(() => import('./pages/BudgetPage'))
const Converter = lazy(() => import('./pages/Converter'))
const Settings = lazy(() => import('./pages/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 pt-8 md:px-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function App() {
  useThemeSync()
  const reducedMotion = useTripStore((s) => s.settings.reducedMotion)
  // CSS-only animations (skeleton shimmer) follow the Settings override too.
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion)
  }, [reducedMotion])

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="trips" element={<Trips />} />
            <Route path="trips/:id" element={<TripDetail />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="converter" element={<Converter />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastViewport />
      <CorruptionPrompt />
    </MotionConfig>
  )
}
