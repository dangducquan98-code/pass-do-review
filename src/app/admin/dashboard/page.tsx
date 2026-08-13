import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Pencil, Trash2, Power } from 'lucide-react'
import { updateItemStatus, deleteItem } from '@/app/actions'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminDashboard({ searchParams }: Props) {
  const params = await searchParams
  const q = typeof params?.q === 'string' ? params.q : ''

  let queryBuilder = supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  if (q) {
    queryBuilder = queryBuilder.ilike('name', `%${q}%`)
  }

  const { data: items, error } = await queryBuilder

  if (error) {
    return <div className="text-red-500">Lỗi tải dữ liệu: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Danh sách sản phẩm</h1>
        <SearchBar placeholder="Tìm món đồ..." />
      </div>
      
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 text-sm font-semibold text-neutral-600">Sản phẩm</th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Giá bán</th>
                <th className="p-4 text-sm font-semibold text-neutral-600">Trạng thái</th>
                <th className="p-4 text-sm font-semibold text-neutral-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items?.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                        {item.images && item.images.length > 0 ? (
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="64px" />
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
                  <td className="p-4 text-right space-x-2">
                    <div className="flex justify-end items-center gap-2">
                      <form action={async () => {
                        'use server'
                        await updateItemStatus(item.id, item.status === 'available' ? 'sold' : 'available')
                        revalidatePath('/admin/dashboard')
                      }}>
                        <button type="submit" className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 border border-transparent rounded-lg transition-all shadow-sm" title="Đổi trạng thái">
                          <Power className="w-4 h-4" />
                        </button>
                      </form>
                      <Link href={`/admin/dashboard/edit/${item.id}`} className="inline-block p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 border border-transparent rounded-lg transition-all shadow-sm" title="Sửa">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteItem(item.id)
                        revalidatePath('/admin/dashboard')
                      }}>
                        <button type="submit" className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent rounded-lg transition-all shadow-sm" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {items?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-neutral-500 font-medium">
                    Chưa có món đồ nào. Hãy thêm đồ mới nhé!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
