import { Calendar, Home, Map, Wallet, ArrowLeftRight } from 'lucide-react'

export const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/trips', label: 'Trips', icon: Map },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/converter', label: 'Converter', icon: ArrowLeftRight },
]
