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
  const [isPending, startTransition] = useTransition()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)

      // Save to server
      startTransition(async () => {
        const itemsToUpdate = newItems.map((item, index) => ({
          id: item.id,
          display_order: index
        }))
        await updateItemsOrder(itemsToUpdate)
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 font-medium shadow-sm">
        Chưa có món đồ nào. Hãy thêm đồ mới nhé!
      </div>
    )
  }

  if (!isMounted) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 w-12"></th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Sản phẩm</th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Giá bán</th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Trạng thái</th>
                <th className="p-4 text-sm font-semibold text-neutral-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 relative">
              <tr>
                <td colSpan={5} className="p-12 text-center text-neutral-500 font-medium">
                  Đang tải...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 w-12"></th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Sản phẩm</th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Giá bán</th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Trạng thái</th>
                <th className="p-4 text-sm font-semibold text-neutral-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 relative">
              <SortableContext 
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableRow key={item.id} item={item} />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
        {isPending && (
          <div className="text-center py-2 text-xs text-neutral-400 bg-neutral-50">Đang lưu thứ tự...</div>
        )}
      </div>
    </div>
  )
}
