import { supabase } from '@/lib/supabase'
import ZaloButton from '@/components/ZaloButton'
import AnimatedHero from '@/components/AnimatedHero'
import ProductSection from '@/components/ProductSection'

// ISR: không đọc searchParams ở đây để trang được prerender tĩnh.
// Tab/từ khóa trên URL do ProductSection tự đọc ở client.
export const revalidate = 60

// Đồ đã bán chỉ để tham khảo nên không tải hết, tránh payload phình theo thời gian.
const SOLD_ITEMS_LIMIT = 24

const ITEM_COLUMNS =
  'id, name, original_price, sell_price, status, images, affiliate_link, display_order, created_at'

export default async function Home() {
  const [availableRes, soldRes] = await Promise.all([
    supabase
      .from('items')
      .select(ITEM_COLUMNS)
      .eq('status', 'available')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase
      .from('items')
      .select(ITEM_COLUMNS, { count: 'exact' })
      .eq('status', 'sold')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(SOLD_ITEMS_LIMIT),
  ])

  const error = availableRes.error || soldRes.error
  const allItems = [...(availableRes.data || []), ...(soldRes.data || [])]
  const soldTotal = soldRes.count ?? soldRes.data?.length ?? 0

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
        <ProductSection items={allItems} soldTotal={soldTotal} />
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
