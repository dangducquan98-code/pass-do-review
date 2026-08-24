import { supabase } from '@/lib/supabase'
import AiMediaUploader from '@/components/AiMediaUploader'
import AiMediaGrid from '@/components/AiMediaGrid'
import { Sparkles, Image as ImageIcon, CheckCircle2, Clock } from 'lucide-react'

export const revalidate = 0

export default async function AiMediaPage() {
  // Fetch items for selector
  const { data: rawItems } = await supabase
    .from('items')
    .select('id, name, status')
    .order('name', { ascending: true })

  const items = rawItems || []

  // Fetch all AI media
  const { data: rawMedia, error } = await supabase
    .from('ai_media')
    .select(`
      id,
      item_id,
      image_url,
      is_posted,
      posted_at,
      platform,
      notes,
      created_at,
      items (
        id,
        name,
        sell_price,
        status
      )
    `)
    .order('created_at', { ascending: false })

  const mediaList = Array.isArray(rawMedia) ? rawMedia : []
  const total = mediaList.length
  const unposted = mediaList.filter(m => !m.is_posted).length
  const posted = mediaList.filter(m => m.is_posted).length

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Kho ảnh cho Hermes AI Agent
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-700 uppercase tracking-wider">
              Threads Bot
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Kho ảnh riêng tư dành cho AI cào & đăng bài tự động lên Threads. 100% ẩn khỏi giao diện khách hàng.
          </p>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tổng ảnh trong kho</p>
            <p className="text-base sm:text-2xl font-black text-neutral-900 mt-0.5">{total}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sẵn sàng (Chưa đăng)</p>
            <p className="text-base sm:text-2xl font-black text-emerald-600 mt-0.5">{unposted}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider">Đã đăng Threads</p>
            <p className="text-base sm:text-2xl font-black text-neutral-800 mt-0.5">{posted}</p>
          </div>
        </div>
      </div>

      {/* Bulk Uploader Component */}
      <AiMediaUploader items={items} />

      {/* Media Gallery / Grid */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
          Danh sách ảnh trong kho ({mediaList.length})
        </h2>
        {error ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs sm:text-sm">
            <p className="font-bold">⚠️ Chưa khởi tạo bảng `ai_media` trên Supabase</p>
            <p className="mt-1">
              Vui lòng mở Supabase Dashboard &gt; SQL Editor và chạy nội dung trong file <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">supabase-ai-media.sql</code> để tạo bảng.
            </p>
          </div>
        ) : (
          <AiMediaGrid initialMedia={mediaList as any} items={items} />
        )}
      </div>
    </div>
  )
}
