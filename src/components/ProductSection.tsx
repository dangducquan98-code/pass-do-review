'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { PackageSearch, Sparkles, CheckCircle2 } from 'lucide-react'
import AnimatedProductGrid from './AnimatedProductGrid'
import SearchBar from './SearchBar'

type Item = {
  id: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
}

type ProductSectionProps = {
  items: Item[]
  initialTab?: string
}

export default function ProductSection({ items, initialTab = 'available' }: ProductSectionProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const currentUrlTab = searchParams.get('tab') || initialTab
  const [activeTab, setActiveTab] = useState<'available' | 'sold'>(
    currentUrlTab === 'sold' ? 'sold' : 'available'
  )

  const initialSearch = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl === 'sold' || tabFromUrl === 'available') {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const updateUrl = (tabVal: 'available' | 'sold', queryVal: string) => {
    const params = new URLSearchParams()
    if (tabVal !== 'available') {
      params.set('tab', tabVal)
    }
    if (queryVal.trim()) {
      params.set('q', queryVal.trim())
    }
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    window.history.replaceState(null, '', newUrl)
  }

  const handleTabChange = (newTab: 'available' | 'sold') => {
    setActiveTab(newTab)
    updateUrl(newTab, searchQuery)
  }

  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery)
    updateUrl(activeTab, newQuery)
  }

  const handleResetSearch = () => {
    setSearchQuery('')
    setActiveTab('available')
    updateUrl('available', '')
  }

  // Filter in memory for instant 0ms response
  const queryLower = searchQuery.toLowerCase().trim()
  const filteredBySearch = items.filter(item => {
    if (!queryLower) return true
    return item.name.toLowerCase().includes(queryLower)
  })

  const availableItems = filteredBySearch.filter(item => item.status === 'available')
  const soldItems = filteredBySearch.filter(item => item.status === 'sold')

  const displayedItems = activeTab === 'sold' ? soldItems : availableItems

  // Counts for tabs based on all items (or search matches)
  const totalAvailable = items.filter(i => i.status === 'available').length
  const totalSold = items.filter(i => i.status === 'sold').length

  return (
    <section id="products" className="py-8 md:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col gap-6 mb-8">
        {/* Title and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PackageSearch className="w-7 h-7 text-blue-600 flex-shrink-0" />
            <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {activeTab === 'sold' ? 'Đồ Đã Thanh Lý' : 'Đồ Đang Có Sẵn'}
            </h2>
          </div>
          <SearchBar 
            placeholder="Tìm món đồ theo tên..." 
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange('')}
          />
        </div>

        {/* Instant Client Tabs (0ms latency) */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-200/60 backdrop-blur-md rounded-2xl border border-neutral-300/40 w-fit shadow-xs">
          <button
            type="button"
            onClick={() => handleTabChange('available')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'available'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'available' ? 'text-white' : 'text-neutral-500'}`} />
            <span>Đang có sẵn</span>
            <span
              className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-extrabold ${
                activeTab === 'available' ? 'bg-white/20 text-white' : 'bg-neutral-300/60 text-neutral-700'
              }`}
            >
              {searchQuery ? availableItems.length : totalAvailable}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('sold')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'sold'
                ? 'bg-neutral-800 text-white shadow-md shadow-neutral-900/20'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'sold' ? 'text-white' : 'text-neutral-500'}`} />
            <span>Đã thanh lý</span>
            <span
              className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-extrabold ${
                activeTab === 'sold' ? 'bg-white/20 text-white' : 'bg-neutral-300/60 text-neutral-700'
              }`}
            >
              {searchQuery ? soldItems.length : totalSold}
            </span>
          </button>
        </div>
      </div>

      {/* Animated Products Grid or Custom Empty State */}
      {displayedItems.length === 0 ? (
        <div className="text-center p-12 md:p-16 bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-3xl shadow-xs space-y-4">
          <p className="text-neutral-500 text-sm md:text-base font-medium">
            {searchQuery 
              ? `Không tìm thấy món đồ nào khớp với từ khóa "${searchQuery}".`
              : (activeTab === 'sold' ? 'Chưa có món đồ nào đã thanh lý.' : 'Hiện tại không có món đồ nào đang pass.')}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={handleResetSearch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Xem tất cả đồ đang bán</span>
            </button>
          )}
        </div>
      ) : (
        <AnimatedProductGrid items={displayedItems} />
      )}
    </section>
  )
}
