'use client'

import Link from 'next/link'
import { Store, MessageCircle, CheckCircle2 } from 'lucide-react'
import ImageGallery from './ImageGallery'
import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'

type Item = {
  id: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
}

export default function ProductCard({ 
  item, 
  priority = false 
}: { 
  item: Item
  priority?: boolean 
}) {
  const isAvailable = item.status === 'available'
  const hasImages = item.images && item.images.length > 0
  const firstImage = hasImages ? item.images[0] : null
  const extraCount = hasImages ? item.images.length - 1 : 0
  
  // Calculate discount percentage if original price exists and is higher than sell price
  const discountPercent = (item.original_price && item.original_price > item.sell_price)
    ? Math.round(((item.original_price - item.sell_price) / item.original_price) * 100)
    : null

  return (
    <div className={`group relative bg-white/80 backdrop-blur-xl border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
      isAvailable 
        ? 'hover:border-blue-500/50 hover:bg-white hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)] hover:-translate-y-1' 
        : 'opacity-85 bg-neutral-100/70 border-neutral-200/80'
    }`}>
      <ImageGallery images={item.images} alt={item.name}>
        <div className="flex flex-col h-full">
          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden bg-neutral-100/80 border-b border-neutral-100/80 group/gallery">
            {firstImage ? (
              <Image 
                src={firstImage} 
                alt={item.name} 
                fill 
                priority={priority}
                className={`object-cover transition-transform duration-700 ease-out ${
                  isAvailable ? 'group-hover:scale-108' : 'grayscale-[35%]'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={65}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs sm:text-sm font-medium bg-neutral-100">
                Không ảnh
              </div>
            )}
            
            {/* Badges on Image (Top-Left) */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 pointer-events-none">
              {!isAvailable ? (
                <div className="bg-neutral-950/85 backdrop-blur-md text-white text-[9px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/10">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ĐÃ PASS
                </div>
              ) : (
                discountPercent && discountPercent > 0 && (
                  <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full shadow-md flex items-center gap-0.5 tracking-tight border border-white/20 animate-pulse">
                    <span>-{discountPercent}%</span>
                  </div>
                )
              )}
            </div>

            {/* Extra Images Badge (Bottom-Right) */}
            {extraCount > 0 && (
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-neutral-950/75 backdrop-blur-md text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg shadow-sm border border-white/10 flex items-center gap-1 z-10 pointer-events-none">
                <ImageIcon className="w-3 h-3" />
                +{extraCount}
              </div>
            )}

            {/* Overlay on hover to indicate clickability */}
            <div className="absolute inset-0 bg-black/0 group-hover/gallery:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover/gallery:opacity-100 transform scale-90 group-hover/gallery:scale-100 transition-all duration-300 bg-white/95 backdrop-blur-md text-neutral-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                Xem ảnh
              </div>
            </div>

            {/* Subtle Gradient Shadow (desktop) */}
            <div className="hidden sm:block absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/15 to-transparent pointer-events-none"></div>
          </div>

          {/* Card Content Body */}
          <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <h3 className={`text-xs sm:text-sm md:text-base font-bold mb-1.5 line-clamp-2 leading-snug transition-colors ${
                isAvailable ? 'text-neutral-900 group-hover:text-blue-600' : 'text-neutral-500'
              }`}>
                {item.name}
              </h3>
              
              {/* Pricing Section */}
              <div className="mt-1">
                <p className={`text-sm sm:text-lg md:text-xl font-black tracking-tight ${
                  isAvailable ? 'text-neutral-950' : 'text-neutral-400'
                }`}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sell_price)}
                </p>
                {item.original_price && (
                  <p className="text-[10px] sm:text-xs text-neutral-400 line-through mt-0.5">
                    Gốc: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price)}
                  </p>
                )}
              </div>
            </div>
            
            {/* Action Button Section */}
            <div className="mt-3 pt-1" onClick={(e) => e.stopPropagation()}>
              {isAvailable ? (
                item.affiliate_link ? (
                  <Link 
                    href={item.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden flex items-center justify-center gap-1.5 w-full py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group-hover:shadow-[0_4px_14px_rgba(37,99,235,0.2)]"
                  >
                    <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs md:text-sm font-bold relative z-10 truncate">Check giá sàn</span>
                    <div className="absolute inset-0 -top-[20px] flex h-[150%] w-8 animate-sweep bg-blue-400/25 rotate-[20deg] blur-[2px] z-0 mix-blend-overlay group-hover:bg-white/40" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-center gap-1 w-full py-1.5 px-2 sm:py-2 sm:px-3 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-400 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold truncate">Chính hãng 100%</span>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center gap-1 w-full py-1.5 px-2 sm:py-2 sm:px-3 rounded-xl bg-neutral-100 border border-neutral-200/80 text-neutral-400 text-center">
                  <span className="text-[10px] sm:text-xs font-bold truncate">Đã thanh lý</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ImageGallery>
    </div>
  )
}
