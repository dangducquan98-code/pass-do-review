'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { toggleAiMediaStatus, deleteAiMedia } from '@/app/actions'
import { Trash2, CheckCircle2, Clock, ExternalLink, Sparkles, Filter, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

import type { AiMediaItem, ItemOption } from '@/lib/types'

export type { AiMediaItem }

type Props = {
  initialMedia: AiMediaItem[]
  items: ItemOption[]
}

export default function AiMediaGrid({ initialMedia, items }: Props) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'unposted' | 'posted'>('all')
  const [filterItemId, setFilterItemId] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Filter items
  const filtered = initialMedia.filter(media => {
    if (filterStatus === 'unposted' && media.is_posted) return false
    if (filterStatus === 'posted' && !media.is_posted) return false
    if (filterItemId !== 'all' && media.item_id !== filterItemId) return false
    return true
  })

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleAiMediaStatus(id, !currentStatus)
      if (res.error) {
        toast.error('Lỗi khi đổi trạng thái: ' + res.error)
      } else {
        toast.success(
          !currentStatus ? 'Đã đánh dấu là ĐÃ ĐĂNG' : 'Đã chuyển về CHƯA ĐĂNG'
        )
      }
    })
  }

  const handleDelete = (id: string, imageUrl: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi kho AI và Supabase Storage?')) return

    startTransition(async () => {
      const res = await deleteAiMedia(id, imageUrl)
      if (res.error) {
        toast.error('Lỗi khi xóa ảnh: ' + res.error)
      } else {
        toast.success('Đã xóa ảnh thành công')
      }
    })
  }

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success('Đã copy đường dẫn ảnh')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100/80 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Tất cả ({initialMedia.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('unposted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'unposted'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Chưa đăng ({initialMedia.filter(m => !m.is_posted).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('posted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === 'posted'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Đã đăng ({initialMedia.filter(m => m.is_posted).length})
          </button>
        </div>

        {/* Product Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400 hidden sm:inline" />
          <select
            value={filterItemId}
            onChange={(e) => setFilterItemId(e.target.value)}
            className="w-full sm:w-56 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="all">Lọc theo tất cả sản phẩm</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200/80 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-800">Không có ảnh nào phù hợp</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Hãy tải thêm ảnh mới bằng khung tải hàng loạt phía trên để cung cấp nguyên liệu cho Hermes AI.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((media) => (
            <div
              key={media.id}
              className={`group relative bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${
                media.is_posted ? 'border-neutral-200 opacity-80' : 'border-neutral-200 hover:border-purple-300'
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                <Image
                  src={media.image_url}
                  alt={media.items?.name || 'AI Media'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  quality={65}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  {media.is_posted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900/80 backdrop-blur-md text-neutral-200">
                      <CheckCircle2 className="w-3 h-3 text-neutral-400" />
                      Đã đăng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 backdrop-blur-md text-white shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-200" />
                      Sẵn sàng
                    </span>
                  )}
                </div>

                {/* Quick Action Overlay on Desktop */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={media.image_url}
                    target="_blank"
                    rel="noreferrer"
                    title="Xem ảnh gốc"
                    className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(media.id, media.image_url)}
                    title="Copy URL ảnh"
                    className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm transition-colors"
                  >
                    {copiedId === media.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(media.id, media.image_url)}
                    title="Xóa ảnh"
                    disabled={isPending}
                    className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Item Info & Actions */}
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-neutral-900 line-clamp-1">
                    {media.items?.name || 'Ảnh tự do (Chưa gắn món)'}
                  </p>
                  {media.notes && (
                    <p className="text-[11px] text-neutral-500 line-clamp-1 italic mt-0.5" title={media.notes}>
                      💡 {media.notes}
                    </p>
                  )}
                  {media.posted_at && (
                    <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Đăng lúc {new Date(media.posted_at).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>

                {/* Toggle Status Button */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(media.id, media.is_posted)}
                  disabled={isPending}
                  className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    media.is_posted
                      ? 'bg-neutral-100 hover:bg-emerald-50 text-neutral-700 hover:text-emerald-700 border border-neutral-200'
                      : 'bg-emerald-50 hover:bg-neutral-100 text-emerald-700 hover:text-neutral-700 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{media.is_posted ? 'Đánh dấu chưa đăng' : 'Đánh dấu đã đăng'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
