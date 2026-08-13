'use client'

import { cn } from '@/lib/utils'

export default function Marquee({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]',
        className
      )}
    >
      <div className="flex shrink-0 animate-marquee flex-row justify-around [gap:var(--gap)]">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="flex shrink-0 animate-marquee flex-row justify-around [gap:var(--gap)]"
      >
        {children}
      </div>
    </div>
  )
}
