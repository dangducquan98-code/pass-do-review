import { supabase } from '@/lib/supabase'
import SearchBar from '@/components/SearchBar'
import SortableAdminList from '@/components/SortableAdminList'
import { Package, DollarSign, CheckCircle2, Plus } from 'lucide-react'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminDashboard({ searchParams }: Props) {
  const params = await searchParams
  const q = typeof params?.q === 'string' ? params.q : ''

  // Fetch all items
  let queryBuilder = supabase
    .from('items')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (q) {
    queryBuilder = queryBuilder.ilike('name', `%${q}%`)
  }

  const { data: items, error } = await queryBuilder

  if (error) {
    return <div className="text-red-500">Lỗi tải dữ liệu: {error.message}</div>
  }

  const allItems = items || []
  const availableItems = allItems.filter(item => item.status === 'available')
  const soldItems = allItems.filter(item => item.status === 'sold')

  const totalInventoryValue = availableItems.reduce((sum, item) => sum + (item.sell_price || 0), 0)

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">Quản lý kho</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Kéo thả để sắp xếp vị trí hiển thị</p>
        </div>

        <Link
          href="/admin/dashboard/add"
          className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm món</span>
        </Link>
      </div>

      {/* Mini Stats Grid (Responsive 3-col on all screens) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
            <Package className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider truncate">Đang bán</p>
            <p className="text-base sm:text-2xl font-black text-neutral-900 mt-0.5">
              {availableItems.length} <span className="text-[10px] sm:text-xs font-normal text-neutral-400">món</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
            <DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider truncate">Tổng giá trị</p>
            <p className="text-sm sm:text-xl font-black text-emerald-600 mt-0.5 truncate">
              {new Intl.NumberFormat('vi-VN', { notation: 'compact', compactDisplay: 'short' }).format(totalInventoryValue)}₫
            </p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider truncate">Đã bán</p>
            <p className="text-base sm:text-2xl font-black text-purple-700 mt-0.5">
              {soldItems.length} <span className="text-[10px] sm:text-xs font-normal text-neutral-400">món</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search & List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-neutral-900">Danh sách tất cả món đồ ({allItems.length})</h2>
          <div className="w-full sm:w-72">
            <SearchBar placeholder="Tìm kiếm trong kho..." />
          </div>
        </div>
        
        <SortableAdminList initialItems={allItems} />
      </div>
    </div>
  )
}
