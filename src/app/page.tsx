import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { Sparkles, PackageSearch } from 'lucide-react'
import Link from 'next/link'
import ZaloButton from '@/components/ZaloButton'
import SearchBar from '@/components/SearchBar'
import AnimatedHero from '@/components/AnimatedHero'
import AnimatedProductGrid from '@/components/AnimatedProductGrid'

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
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (q) {
    queryBuilder = queryBuilder.ilike('name', `%${q}%`)
  }

  const { data: items, error } = await queryBuilder

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-blue-500/20 overflow-x-hidden">
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Products Grid */}
      <section id="products" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
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
          <AnimatedProductGrid items={items || []} />
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
