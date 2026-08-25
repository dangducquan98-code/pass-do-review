'use client'

import dynamic from 'next/dynamic'
import type { Item } from '@/lib/types'

const SortableAdminList = dynamic(() => import('./SortableAdminList'), {
  ssr: false,
  loading: () => (
    <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center text-neutral-500 font-medium shadow-sm">
      Đang tải danh sách kho...
    </div>
  ),
})

export default function SortableAdminListLazy({
  initialItems,
}: {
  initialItems: Item[]
}) {
  return <SortableAdminList initialItems={initialItems} />
}
