'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { updateItemsOrder } from '@/app/actions'
import SortableRow from './SortableRow'
import { toast } from 'sonner'

type Item = {
  id: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
  display_order?: number
}

export default function SortableAdminList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all')
  const [isPending, startTransition] = useTransition()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const handleStatusChange = (id: string, newStatus: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item))
  }

  const handleItemDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // require 8px movement before drag starts (to allow clicking buttons inside)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex)
        setItems(newItems)

        // Save to server
        startTransition(async () => {
          const itemsToUpdate = newItems.map((item, index) => ({
            id: item.id,
            display_order: index
          }))
          const res = await updateItemsOrder(itemsToUpdate)
          if (res?.error) {
            toast.error(`Lỗi lưu thứ tự: ${res.error}`)
          } else {
            toast.success('Đã lưu thứ tự hiển thị mới!')
          }
        })
      }
    }
  }

  const availableCount = items.filter(i => i.status === 'available').length
  const soldCount = items.filter(i => i.status === 'sold').length
  const filteredItems = items.filter(item => {
    if (statusFilter === 'available') return item.status === 'available'
    if (statusFilter === 'sold') return item.status === 'sold'
    return true
  })

  if (!isMounted) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center text-neutral-500 font-medium shadow-sm">
        Đang tải danh sách kho...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-200/60 backdrop-blur-md rounded-2xl border border-neutral-300/40 w-fit">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            statusFilter === 'all'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <span>Tất cả</span>
          <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-extrabold ${
            statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-300/60 text-neutral-700'
          }`}>
            {items.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('available')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            statusFilter === 'available'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <span>Đang bán</span>
          <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-extrabold ${
            statusFilter === 'available' ? 'bg-white/20 text-white' : 'bg-neutral-300/60 text-neutral-700'
          }`}>
            {availableCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('sold')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            statusFilter === 'sold'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <span>Đã thanh lý</span>
          <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-extrabold ${
            statusFilter === 'sold' ? 'bg-white/20 text-white' : 'bg-neutral-300/60 text-neutral-700'
          }`}>
            {soldCount}
          </span>
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 font-medium">
            Không có món đồ nào ở trạng thái này.
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            onDragEnd={handleDragEnd}
          >
            <div className="divide-y divide-neutral-100">
              <SortableContext 
                items={filteredItems.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredItems.map((item) => (
                  <SortableRow 
                    key={item.id} 
                    item={item} 
                    onStatusChange={handleStatusChange}
                    onDelete={handleItemDelete}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        )}
        {isPending && (
          <div className="text-center py-2 text-xs text-neutral-400 bg-neutral-50 border-t border-neutral-100">
            Đang lưu thứ tự...
          </div>
        )}
      </div>
    </div>
  )
}
