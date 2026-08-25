import { supabase } from '@/lib/supabase'
import ZaloButton from '@/components/ZaloButton'
import AnimatedHero from '@/components/AnimatedHero'
import ProductSection from '@/components/ProductSection'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams
  const tab = typeof params?.tab === 'string' ? params.tab : 'available'

  const { data: allItems, error } = await supabase
    .from('items')
    .select(
      'id, name, original_price, sell_price, status, images, affiliate_link, display_order, created_at'
    )
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-neutral-50 selection:bg-blue-500/20 overflow-x-hidden">
      <AnimatedHero />

      {error ? (
        <div className="text-center p-12 bg-white border border-red-100 rounded-2xl shadow-sm">
          <p className="text-red-500 font-medium">
            Không thể tải dữ liệu sản phẩm. Vui lòng kiểm tra kết nối cơ sở dữ liệu.
          </p>
        </div>
      ) : (
        <ProductSection items={allItems || []} initialTab={tab} />
      )}

      <footer className="border-t border-neutral-200 py-10 text-center mt-12 bg-white">
        <p className="text-neutral-500 text-sm">
          © {new Date().getFullYear()} Góc Review. Mọi thắc mắc liên hệ qua Zalo của mình.
        </p>
      </footer>

      <ZaloButton />
    </main>
  )
}
