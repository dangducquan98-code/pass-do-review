'use client'

import { useState } from 'react'
import { compressImage } from '@/lib/image-compression'
import { supabase } from '@/lib/supabase'
import { addItem, editItem } from '@/app/actions'
import { UploadCloud, Loader2, X } from 'lucide-react'
import Image from 'next/image'

import { toast } from 'sonner'

type ItemData = {
  id?: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
}

export default function AdminItemForm({ initialData }: { initialData?: ItemData }) {
  const [loading, setLoading] = useState(false)
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || [])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const isEditing = !!initialData?.id

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviews])
    setNewImageFiles(prev => [...prev, ...files])
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => {
      const urls = [...prev]
      URL.revokeObjectURL(urls[index])
      urls.splice(index, 1)
      return urls
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      let uploadedUrls: string[] = []
      
      // Upload new images to Supabase
      if (newImageFiles.length > 0) {
        toast.loading('Đang tối ưu và tải ảnh lên kho...', { id: 'upload-toast' })
        const uploadPromises = newImageFiles.map(async (file) => {
          const compressedFile = await compressImage(file)
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
          
          const { error } = await supabase.storage
            .from('item-images')
            .upload(fileName, compressedFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (error) throw error

          const { data: publicUrlData } = supabase.storage
            .from('item-images')
            .getPublicUrl(fileName)
            
          return publicUrlData.publicUrl
        })

        uploadedUrls = await Promise.all(uploadPromises)
        toast.dismiss('upload-toast')
      }

      const allImages = [...existingImages, ...uploadedUrls]
      formData.append('images', JSON.stringify(allImages))
      if (!isEditing) {
        formData.append('status', 'available')
      }
      
      toast.success(isEditing ? 'Đã cập nhật sản phẩm thành công!' : 'Đã thêm sản phẩm mới thành công!')

      // Call Server Action
      let actionResult;
      if (isEditing && initialData?.id) {
        actionResult = await editItem(initialData.id, formData)
      } else {
        actionResult = await addItem(formData)
      }
      
      if (actionResult?.error) {
        throw new Error(actionResult.error)
      }
      
    } catch (error: any) {
      if (error?.message === 'NEXT_REDIRECT') {
        throw error
      }
      console.error(error)
      toast.error(`Lỗi: ${error.message || 'Không xác định'}`)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 shadow-sm">
      {/* Image Upload */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-neutral-900 mb-2 sm:mb-3">
          Hình ảnh sản phẩm <span className="text-neutral-400 font-normal">(chọn 1 hoặc nhiều ảnh)</span>
        </label>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-4 mb-2">
          {existingImages.map((url, i) => (
            <div key={`exist-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group shadow-xs">
              <Image src={url} alt="Product" fill className="object-cover" sizes="150px" quality={65} />
              <button 
                type="button" 
                onClick={() => removeExistingImage(i)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-xs"
                title="Xóa ảnh này"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {previewUrls.map((url, i) => (
            <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 group shadow-xs">
              <Image src={url} alt="Preview" fill className="object-cover" sizes="150px" quality={65} />
              <button 
                type="button" 
                onClick={() => removeNewImage(i)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-xs"
                title="Xóa ảnh này"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-blue-600/90 text-white text-[9px] font-bold rounded shadow-xs backdrop-blur-xs">MỚI</div>
            </div>
          ))}

          <div className="relative aspect-square flex items-center justify-center border-2 border-neutral-200 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors bg-neutral-50 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="text-center text-neutral-500 p-1">
              <UploadCloud className="mx-auto h-5 w-5 sm:h-7 sm:w-7 mb-1 text-neutral-400" />
              <span className="text-[11px] sm:text-xs font-semibold block leading-tight">Thêm ảnh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-bold text-neutral-900 mb-1.5">Tên món đồ</label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name}
            required
            className="w-full px-3.5 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
            placeholder="Ví dụ: Bàn phím cơ Keychron Q1"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-neutral-900 mb-1.5">Giá gốc (VND)</label>
          <input
            type="number"
            name="original_price"
            defaultValue={initialData?.original_price || ''}
            className="w-full px-3.5 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
            placeholder="3000000"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-neutral-900 mb-1.5">Giá bán lại (VND)</label>
          <input
            type="number"
            name="sell_price"
            defaultValue={initialData?.sell_price}
            required
            className="w-full px-3.5 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
            placeholder="1500000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-bold text-neutral-900 mb-1.5">Link Shopee/TikTok (Affiliate)</label>
          <input
            type="url"
            name="affiliate_link"
            defaultValue={initialData?.affiliate_link || ''}
            className="w-full px-3.5 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
            placeholder="https://shope.ee/..."
          />
        </div>

        {isEditing && (
          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm font-bold text-neutral-900 mb-1.5">Trạng thái</label>
            <select
              name="status"
              defaultValue={initialData?.status}
              className="w-full px-3.5 py-2.5 sm:py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs cursor-pointer"
            >
              <option value="available">Còn hàng (Đang bán)</option>
              <option value="sold">Đã bán (Đã thanh lý)</option>
            </select>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-neutral-200">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật món đồ' : 'Thêm món đồ')}
        </button>
      </div>
    </form>
  )
}
