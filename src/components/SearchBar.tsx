'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useTransition, useState, useEffect } from 'react'

type SearchBarProps = {
  placeholder?: string
  value?: string
  onChange?: (val: string) => void
  onClear?: () => void
}

export default function SearchBar({ 
  placeholder = 'Tìm kiếm sản phẩm...',
  value,
  onChange,
  onClear
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const initialQuery = searchParams.get('q') || ''
  const [internalQuery, setInternalQuery] = useState(initialQuery)

  const isControlled = value !== undefined
  const currentVal = isControlled ? value : internalQuery

  useEffect(() => {
    if (isControlled) return

    const timeoutId = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams)
        if (internalQuery) {
          params.set('q', internalQuery)
        } else {
          params.delete('q')
        }
        router.replace(`${pathname}?${params.toString()}`)
      })
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [internalQuery, pathname, router, searchParams, isControlled])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (isControlled) {
      onChange?.(val)
    } else {
      setInternalQuery(val)
    }
  }

  const handleClear = () => {
    if (isControlled) {
      onChange?.('')
      onClear?.()
    } else {
      setInternalQuery('')
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`w-4 h-4 sm:w-5 sm:h-5 ${isPending ? 'text-blue-500 animate-pulse' : 'text-neutral-400'}`} />
      </div>
      <input
        type="search"
        aria-label={placeholder}
        className="block w-full pl-10 pr-10 py-3 bg-white border border-line rounded-2xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-all shadow-sm placeholder:text-muted"
        placeholder={placeholder}
        value={currentVal}
        onChange={handleInputChange}
      />
      {currentVal && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          title="Xóa tìm kiếm"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
