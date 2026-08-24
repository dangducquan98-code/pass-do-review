'use client'

import { useState } from 'react'
import { compressImage } from '@/lib/image-compression'
import { supabase } from '@/lib/supabase'
import { bulkAddAiMedia } from '@/app/actions'
import { UploadCloud, Loader2, X, Sparkles, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

type ItemOption = {
  id: string
  name: string
  status: string
}

type Props = {
  items: ItemOption[]
  onUploadSuccess?: () => void
}

export default function AiMediaUploader({ items, onUploadSuccess }: Props) {
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; stage: string }>({
    current: 0,
    total: 0,
    stage: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      const copy = [...prev]
      URL.revokeObjectURL(copy[index])
      copy.splice(index, 1)
      return copy
    })
  }

  const clearAll = () => {
    previews.forEach(url => URL.revokeObjectURL(url))
    setFiles([])
    setPreviews([])
    setNotes('')
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ảnh để tải lên')
      return
    }

    setIsUploading(true)
    const totalFiles = files.length
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i]

        // Step 1: Compress & resize image client-side to WebP
        setUploadProgress({
          current: i + 1,
          total: totalFiles,
          stage: `Đang nén & tối ưu ảnh ${i + 1}/${totalFiles}...`
        })
        const compressedFile = await compressImage(file)

        // Step 2: Upload to Supabase Storage with 'ai/' prefix
        setUploadProgress({
          current: i + 1,
          total: totalFiles,
          stage: `Đang tải lên Supabase ${i + 1}/${totalFiles}...`
        })

        const fileName = `ai/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
        const { error: storageError } = await supabase.storage
          .from('item-images')
          .upload(fileName, compressedFile, {
            cacheControl: '31536000', // 1 year cache
            upsert: false
          })

        if (storageError) {
          throw new Error(`Lỗi upload ảnh ${file.name}: ${storageError.message}`)
        }

        const { data: publicUrlData } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrlData.publicUrl)
      }

      // Step 3: Insert records into ai_media table
      setUploadProgress({
        current: totalFiles,
        total: totalFiles,
        stage: 'Đang lưu vào kho ảnh AI...'
      })

      const res = await bulkAddAiMedia({
        item_id: selectedItemId || null,
        image_urls: uploadedUrls,
        notes: notes.trim() || undefined
      })

      if (res.error) {
        throw new Error(res.error)
      }

      toast.success(`Đã nén và thêm thành công ${uploadedUrls.length} ảnh vào kho AI!`, {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      })

      clearAll()
      if (onUploadSuccess) onUploadSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải ảnh lên'
      console.error('Lỗi bulk upload:', err)
      toast.error(msg)
    } finally {
      setIsUploading(false)
      setUploadProgress({ current: 0, total: 0, stage: '' })
    }
  }

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900">Tải ảnh hàng loạt cho Hermes AI</h2>
          <p className="text-xs text-neutral-500">Tự động resize & nén WebP nhỏ gọn trước khi lưu vào Supabase</p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Select Product */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Gắn vào sản phẩm
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
            >
              <option value="">-- Kho ảnh chung (Không gắn sản phẩm) --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.status === 'available' ? 'Đang bán' : 'Đã bán'})
                </option>
              ))}
            </select>
          </div>

          {/* Notes / Prompt hint for AI */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Gợi ý caption cho AI (Không bắt buộc)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Chụp góc cận cảnh màn hình, setup bàn làm việc..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
            />
          </div>
        </div>

        {/* Upload Dropzone */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
            Chọn hoặc kéo thả nhiều ảnh ({files.length} ảnh đã chọn)
          </label>
          <div className="relative border-2 border-dashed border-neutral-300 hover:border-purple-500 bg-neutral-50/50 hover:bg-purple-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-neutral-700">
                  Bấm để chọn hoặc kéo thả nhiều ảnh cùng lúc
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Hỗ trợ PNG, JPG, WEBP. Hệ thống tự động nén & resize xuống ≤ 600KB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-600">
                Xem trước ảnh đã chọn ({previews.length})
              </span>
              <button
                type="button"
                onClick={clearAll}
                disabled={isUploading}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto p-2 bg-neutral-50 rounded-xl border border-neutral-200">
              {previews.map((url, index) => (
                <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group bg-neutral-200">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="80px"
                    quality={60}
                    className="object-cover"
                  />
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <span className="absolute bottom-1 left-1 px-1 bg-black/60 text-[9px] text-white font-mono rounded">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {isUploading && (
          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                {uploadProgress.stage}
              </span>
              <span>
                {uploadProgress.current}/{uploadProgress.total}
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(uploadProgress.current / Math.max(uploadProgress.total, 1)) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isUploading || files.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-300 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý ({uploadProgress.current}/{uploadProgress.total})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Tải lên {files.length > 0 ? `(${files.length} ảnh)` : ''}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
