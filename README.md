# Wayfare — Travel Planner Dashboard

A calm, offline-first travel planner. Add trips, attach bookings, plan the itinerary day by day, track a budget and
expenses, pack with a checklist, keep notes per place, and see everything on a calendar and in charts. A currency
converter lives on the dashboard.

Frontend only: **no backend, no auth, no network requests.** All data lives in `localStorage`.

## Run it

Requires Node 18+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint      # ESLint (React + hooks rules)
```

On first launch the dashboard is empty. Click **Load demo data** (dashboard, Trips page or Settings) to see seven
sample trips covering every status. Demo dates are relative to today, so statuses stay accurate.

## Stack

Vite + React 18 (JSX), Tailwind CSS with CSS-variable tokens (light and dark), Framer Motion, react-router-dom,
Zustand with `persist`, date-fns, Recharts (area chart only), lucide-react, nanoid. Fonts (Plus Jakarta Sans, Inter)
are bundled through `@fontsource-variable`, so nothing is fetched at runtime.

## Project structure

```
src/
  main.jsx, App.jsx, index.css     entry, routes, design tokens
  components/
    layout/      Navbar, MobileTabBar, PageShell, AppLayout, ErrorBoundary, CorruptionPrompt
    ui/          Button, Card, Chip, Input, Textarea, Select, DateRangePicker, Tabs, SegmentedControl,
                 Modal, Drawer, ConfirmDialog, Toast, Tooltip, Skeleton, EmptyState, ProgressBar,
                 Avatar, Checkbox, Toggle, Dropdown
    charts/      StatusRing, BudgetGauge, CategoryCapsule, ProgressRing, Sparkline, MonthlyBars,
                 BudgetVsActual, SpendTrend, TimelineStrip, ChartCard
    dashboard/   StatCard, NextTripHero, UpcomingTrips, MiniCalendar, ItineraryProgress, BudgetOverview,
                 ConverterWidget, RecentNotes, PackingSnapshot
    trips/       TripCard, TripForm, TripDrawer, TripHeader, TripOverview
    itinerary/   ItineraryList, ItineraryItemRow, ItineraryForm
    bookings/    BookingList, BookingCard, FlightTicket, BookingForm, ConfirmationCode
    budget/      BudgetTab, BudgetSummary, ExpenseList, ExpenseForm, TripBudgetTable
    packing/     PackingList
    notes/       NoteList, NoteCard, NoteEditor
    calendar/    CalendarGrid, DayPanel
    settings/    RateOverrides, DataPanel, ResetDialog
  pages/         Dashboard, Trips, TripDetail, CalendarPage, BudgetPage, Converter, Settings, NotFound
  store/         useTripStore.js (Zustand + persist), selectors.js (derived status, totals), useToastStore.js
  services/      storage.js (the only code that touches localStorage), currency.js (getRates)
  data/          rates.js, demoData.js, packingTemplates.js
  lib/           motion.js (shared animation presets), dates.js, format.js, money.js, colors.js, status.js,
                 categories.js, calendar.js, snapshot.js, validation.js, image.js, download.js, nav.js, cn.js
  hooks/         useTheme, useReducedMotion, useCountUp, useNow, useRates, useConverter, useTripData,
                 useFocusTrap, useFormFocus, useAutoAdd, useMediaQuery, useDocumentTitle
```

## How it works

- **Derived trip status** (Upcoming, Ongoing, Completed, Missed, Cancelled) is computed in `store/selectors.js` and
  never stored. A trip whose dates passed without being marked completed is **Missed** and shows a gentle prompt.
- **Spend** per trip is manual expenses plus non-cancelled booking costs, converted to the trip currency. Booking
  costs show as read-only "From booking" rows and are never duplicated as expenses.
- **Theme** is applied before first paint by an inline script in `index.html`, so there is no flash. It reads the
  same `wayfare:v1` key the store writes.
- **Motion** uses presets from `src/lib/motion.js` and respects both `prefers-reduced-motion` and the Settings
  toggle (Framer's `MotionConfig`, plus a `reduce-motion` class for CSS animations).
- **Data safety:** unreadable saved data shows a prompt to start fresh; import validates the file and confirms before
  replacing; Reset needs you to type `RESET`.

## Where to plug in a backend

Everything that persists goes through two places. Replace these and the UI does not change.

1. **`src/services/storage.js`** is the only module that touches `localStorage`. It exposes `getItem`, `setItem` and
   `removeItem` (the shape Zustand's `persist` expects). To use a remote store, implement the same three methods
   against your API (they may be async), or drop `persist` and load and save in the store actions.
2. **`src/store/useTripStore.js`** holds every create, update and delete as actions (`addTrip`, `updateBooking`,
   `removeTrip`, ...). For a REST, Firebase or Supabase backend, make these actions call the API and then update
   state. IDs are already string-based (`nanoid`) and records reference each other by `tripId`, which maps directly
   to relational tables.

Other notes for a backend:

- `schemaVersion` and the `migrate` function in `useTripStore.js` are the hook for evolving stored data.
- Auth can wrap the router in `src/App.jsx`.
- Export and import (`src/lib/snapshot.js`) already define a validated, versioned JSON shape you can reuse for
  server sync.

## Where to plug in a real currency API

`src/services/currency.js` exports `getRates(base)`, which returns `{ base, rates, lastUpdated }` asynchronously. Today
it reads the static table in `src/data/rates.js` (USD base, about 20 currencies). Replace its body with a call to a
live exchange-rate API and keep the return shape; `useRates` (and everything that converts money) picks it up
automatically. Manual overrides set in Settings (`settings.rateOverrides`) are applied on top in `src/hooks/useRates.js`,
so they keep working offline.

## Accessibility

Keyboard navigation with visible focus rings, a skip link, focus moving to the page after navigation, focus
trapping and Escape handling in dialogs and drawers, ARIA labels on charts and icon buttons, and status always
shown with an icon and text as well as colour. Colour tokens are checked for WCAG AA contrast in both themes
(text and muted text, status chips, buttons, banners).

## Known limits

- Rates are static and approximate; update `src/data/rates.js` or use Settings overrides.
- Uploaded cover images are stored as data URLs (compressed under 300KB) and count against the browser's
  `localStorage` quota (roughly 5MB), so many large covers will eventually fill it.
- Hydration from `localStorage` is synchronous, so skeletons appear only while route chunks load.
