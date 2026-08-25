'use client'

import ProductCard from './ProductCard'
import type { Item } from '@/lib/types'

export default function AnimatedProductGrid({
  items,
  emptyMessage,
}: {
  items: Item[]
  emptyMessage?: string
}) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-16 md:p-20 bg-white/70 backdrop-blur-md border border-neutral-200 border-dashed rounded-3xl shadow-sm">
        <p className="text-neutral-500 text-base md:text-lg font-medium">
          {emptyMessage ||
            'Hiện tại không có món đồ nào. Bạn quay lại sau nhé!'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="h-full animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index, 12) * 80}ms` }}
        >
          <ProductCard item={item} priority={index < 4} />
        </div>
      ))}
    </div>
  )
}
