'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import SearchBar from './SearchBar'

/** Ô tìm kiếm của admin: debounce rồi ghi `q` lên URL để server lọc lại. */
export default function AdminSearchBar({ placeholder }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('q') || '')

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
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [query, pathname, router, searchParams])

  return (
    <SearchBar
      placeholder={placeholder}
      value={query}
      onChange={setQuery}
      isPending={isPending}
    />
  )
}
