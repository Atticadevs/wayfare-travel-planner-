import { cn } from '../../lib/cn'

export function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-control', className)} />
}
