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

export default function SortableRow({ item }: { item: Item }) {
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
    startTransition(async () => {
      await updateItemStatus(item.id, item.status === 'available' ? 'sold' : 'available')
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      startTransition(async () => {
        await deleteItem(item.id)
        router.refresh()
      })
    }
  }

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-neutral-50/80 transition-colors bg-white ${
        isDragging ? 'shadow-lg border border-blue-200 opacity-90' : ''
      }`}
    >
      <td className="p-4 w-12 text-center">
        <button 
          className="p-2 text-neutral-300 hover:text-neutral-600 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          title="Kéo thả để sắp xếp"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0 pointer-events-none">
            {item.images && item.images.length > 0 ? (
              <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="64px" quality={60} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px] font-medium uppercase">No img</div>
            )}
          </div>
          <div className="font-bold text-neutral-900 line-clamp-2">{item.name}</div>
        </div>
      </td>
      <td className="p-4">
        <span className="font-bold text-neutral-900 block">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sell_price)}
        </span>
        {item.original_price && (
          <span className="block text-xs font-medium text-neutral-400 line-through mt-0.5">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price)}
          </span>
        )}
      </td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
          item.status === 'available' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-neutral-100 text-neutral-600 border-neutral-200'
        }`}>
          {item.status === 'available' ? 'Còn hàng' : 'Đã bán'}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end items-center gap-2">
          <button 
            onClick={handleStatusToggle} 
            disabled={isPending}
            className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 border border-transparent rounded-lg transition-all shadow-sm" 
            title="Đổi trạng thái"
          >
            <Power className="w-4 h-4" />
          </button>
          
          <Link 
            href={`/admin/dashboard/edit/${item.id}`} 
            className="inline-block p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 border border-transparent rounded-lg transition-all shadow-sm" 
            title="Sửa"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          
          <button 
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent rounded-lg transition-all shadow-sm" 
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
