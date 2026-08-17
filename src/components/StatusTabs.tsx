'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sparkles, CheckCircle2, LayoutGrid } from 'lucide-react'

type StatusTabsProps = {
  availableCount: number
  soldCount: number
}

export default function StatusTabs({ availableCount, soldCount }: StatusTabsProps) {
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'available'
  const createTabUrl = (tabValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tabValue === 'available') {
      params.delete('tab')
    } else {
      params.set('tab', tabValue)
    }
    const queryString = params.toString()
    return queryString ? `/?${queryString}` : '/'
  }

  const tabs = [
    {
      id: 'available',
      label: 'Đang có sẵn',
      count: availableCount,
      icon: Sparkles,
      activeColor: 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
    },
    {
      id: 'sold',
      label: 'Đã thanh lý',
      count: soldCount,
      icon: CheckCircle2,
      activeColor: 'bg-neutral-800 text-white shadow-md shadow-neutral-900/20'
    }
  ]

  return (
    <div className="flex items-center gap-1.5 p-1 bg-neutral-200/60 backdrop-blur-md rounded-2xl border border-neutral-300/40 w-fit">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id
        const Icon = tab.icon
        return (
          <Link
            key={tab.id}
            href={createTabUrl(tab.id)}
            scroll={false}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive
                ? tab.activeColor
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
            <span>{tab.label}</span>
            <span
              className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-extrabold ${
                isActive ? 'bg-white/20 text-white' : 'bg-neutral-300/60 text-neutral-700'
              }`}
            >
              {tab.count}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
