import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Sparkles, PackageSearch } from 'lucide-react'
import Link from 'next/link'
import ZaloButton from '@/components/ZaloButton'
import SearchBar from '@/components/SearchBar'

export const revalidate = 0

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams
  const q = typeof params?.q === 'string' ? params.q : ''

  let queryBuilder = supabase
    .from('items')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (q) {
    queryBuilder = queryBuilder.ilike('name', `%${q}%`)
  }

  const { data: items, error } = await queryBuilder

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-blue-500/20">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-neutral-200">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-blue-600 text-xs font-semibold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Đồ Review Thanh Lý</span>
        </div>
        
        <h1 className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Săn Đồ Giá Rẻ, Chất Lượng Như Mới
        </h1>
        <p className="mt-3 text-sm md:text-base text-neutral-500 max-w-lg mx-auto font-medium">
          100% hàng mới, chỉ unbox quay video rồi gói lại
        </p>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <PackageSearch className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Đồ Đang Có Sẵn</h2>
          </div>
          <SearchBar placeholder="Tìm món đồ..." />
        </div>

        {error ? (
          <div className="text-center p-12 bg-white border border-red-100 rounded-2xl shadow-sm">
            <p className="text-red-500 font-medium">Không thể tải dữ liệu sản phẩm. Vui lòng kiểm tra kết nối cơ sở dữ liệu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {items?.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {items?.length === 0 && (
          <div className="text-center p-20 bg-white border border-neutral-200 border-dashed rounded-3xl shadow-sm">
            <p className="text-neutral-500 text-lg">Hiện tại không có món đồ nào đang pass. <br/>Bạn quay lại sau nhé!</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-10 text-center mt-12 bg-white">
        <p className="text-neutral-500 text-sm">
          © {new Date().getFullYear()} Góc Review. Mọi thắc mắc liên hệ qua mạng xã hội của mình.
        </p>
      </footer>
      
      {/* Floating Zalo Button */}
      <ZaloButton />
    </main>
  )
}
