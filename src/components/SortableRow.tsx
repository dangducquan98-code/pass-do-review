'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import Link from 'next/link'
import { Pencil, Trash2, Power, GripVertical } from 'lucide-react'
import { updateItemStatus, deleteItem } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

type Item = {
  id: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
}

import { toast } from 'sonner'

type SortableRowProps = {
  item: Item
  onStatusChange?: (id: string, newStatus: string) => void
  onDelete?: (id: string) => void
}

export default function SortableRow({ item, onStatusChange, onDelete }: SortableRowProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  const handleStatusToggle = () => {
    const nextStatus = item.status === 'available' ? 'sold' : 'available'
    // 1. Optimistic update (0ms UI latency)
    onStatusChange?.(item.id, nextStatus)

    // 2. Server mutation
    startTransition(async () => {
      const res = await updateItemStatus(item.id, nextStatus)
      if (res?.error) {
        // Revert on error
        onStatusChange?.(item.id, item.status)
        toast.error(`Lỗi: ${res.error}`)
      } else {
        toast.success(nextStatus === 'sold' ? 'Đã chuyển thành ĐÃ BÁN' : 'Đã chuyển thành ĐANG BÁN')
      }
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${item.name}"?`)) {
      // 1. Optimistic removal
      onDelete?.(item.id)

      // 2. Server mutation
      startTransition(async () => {
        const res = await deleteItem(item.id)
        if (res?.error) {
          toast.error(`Lỗi xóa: ${res.error}`)
        } else {
          toast.success('Đã xóa món đồ và dọn dẹp ảnh thành công!')
        }
        router.refresh()
      })
    }
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 bg-white hover:bg-neutral-50/90 transition-colors ${
        isDragging ? 'shadow-2xl rounded-2xl border-2 border-blue-500 bg-blue-50/40 opacity-95 z-50' : ''
      }`}
    >
      {/* Drag Grip */}
      <button 
        type="button"
        className="p-1 sm:p-2 text-neutral-300 hover:text-neutral-700 active:text-neutral-900 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
        {...attributes}
        {...listeners}
        title="Kéo thả để sắp xếp vị trí"
      >
        <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Thumbnail */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 flex-shrink-0 pointer-events-none">
        {item.images && item.images.length > 0 ? (
          <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="56px" quality={60} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[9px] font-bold uppercase">No img</div>
        )}
      </div>

      {/* Item Info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="font-bold text-neutral-900 text-xs sm:text-sm truncate sm:line-clamp-2">
          {item.name}
        </div>
        <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
          <span className="font-black text-xs sm:text-sm text-neutral-900">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sell_price)}
          </span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold border shadow-xs ${
            item.status === 'available' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' 
              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
          }`}>
            {item.status === 'available' ? 'Đang bán' : 'Đã bán'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button"
          onClick={handleStatusToggle} 
          disabled={isPending}
          className={`p-2 rounded-lg border transition-all ${
            item.status === 'available'
              ? 'text-emerald-600 hover:bg-emerald-50 border-emerald-200/60 bg-emerald-50/40'
              : 'text-neutral-400 hover:bg-neutral-100 border-neutral-200 bg-neutral-50'
          }`}
          title={item.status === 'available' ? 'Bấm để đánh dấu ĐÃ BÁN' : 'Bấm để mở bán lại'}
        >
          <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        
        <Link 
          href={`/admin/dashboard/edit/${item.id}`} 
          className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 border border-neutral-200 hover:border-blue-100 rounded-lg transition-all" 
          title="Sửa sản phẩm"
        >
          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
        
        <button 
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-neutral-200 hover:border-red-100 rounded-lg transition-all" 
          title="Xóa sản phẩm"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}
