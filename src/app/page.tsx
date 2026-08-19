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

  // Fetch all items with fast ISR caching
  const { data: allItems, error } = await supabase
    .from('items')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background selection:bg-brand/20 overflow-x-hidden">
      {/* Animated Hero Section */}
      <AnimatedHero />

        {error ? (
          <div className="text-center p-12 bg-white border border-red-100 rounded-2xl shadow-sm">
            <p className="text-red-500 font-medium">Không thể tải dữ liệu sản phẩm. Vui lòng kiểm tra kết nối cơ sở dữ liệu.</p>
          </div>
        ) : (
          <ProductSection items={allItems || []} initialTab={tab} />
        )}

      {/* Footer */}
      <footer className="border-t border-line py-10 px-4 text-center mt-12 bg-surface">
        <p className="text-neutral-500 text-sm">
          © {new Date().getFullYear()} Góc Review. Mọi thắc mắc liên hệ qua Zalo của mình.
        </p>
      </footer>
      
      {/* Floating Zalo Button */}
      <ZaloButton />
    </main>
  )
}
