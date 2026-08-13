import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Pencil, Trash2, Power } from 'lucide-react'
import { updateItemStatus, deleteItem } from '@/app/actions'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import SortableAdminList from '@/components/SortableAdminList'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminDashboard({ searchParams }: Props) {
  const params = await searchParams
  const q = typeof params?.q === 'string' ? params.q : ''

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Danh sách sản phẩm</h1>
        <SearchBar placeholder="Tìm món đồ..." />
      </div>
      
      <SortableAdminList initialItems={items || []} />
    </div>
  )
}
