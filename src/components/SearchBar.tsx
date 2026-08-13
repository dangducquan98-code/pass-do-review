'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useTransition, useState, useEffect } from 'react'

export default function SearchBar({ placeholder = 'Tìm kiếm sản phẩm...' }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams)
        if (query) {
          params.set('q', query)
        } else {
          params.delete('q')
        }
        router.replace(`${pathname}?${params.toString()}`)
      })
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [query, pathname, router, searchParams])

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`w-5 h-5 ${isPending ? 'text-blue-500 animate-pulse' : 'text-neutral-400'}`} />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
