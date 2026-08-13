'use client'

import Link from 'next/link'
import { Store } from 'lucide-react'
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

export default function ProductCard({ item }: { item: Item }) {
  const isAvailable = item.status === 'available'
  const hasImages = item.images && item.images.length > 0
  const firstImage = hasImages ? item.images[0] : null
  const extraCount = hasImages ? item.images.length - 1 : 0
  
  return (
    <div className="group relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl overflow-hidden hover:border-blue-400 hover:bg-white/90 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-row md:flex-col h-full">
      <ImageGallery images={item.images} alt={item.name}>
        <div className="flex flex-row md:flex-col h-full">
          {/* Image Container */}
          <div className="relative w-[110px] md:w-full md:aspect-square overflow-hidden bg-neutral-100/50 flex-shrink-0 border-r md:border-r-0 md:border-b border-neutral-200/50 self-stretch group/gallery">
            {firstImage ? (
              <Image 
                src={firstImage} 
                alt={item.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                sizes="(max-width: 768px) 110px, (max-width: 1200px) 33vw, 25vw"
                quality={65}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-medium bg-neutral-100">
                Không ảnh
              </div>
            )}
            
            {/* Overlay on hover to indicate clickability */}
            <div className="absolute inset-0 bg-black/0 group-hover/gallery:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover/gallery:opacity-100 transform scale-90 group-hover/gallery:scale-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-neutral-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Xem ảnh
              </div>
            </div>

            {/* Extra Images Badge */}
            {extraCount > 0 && (
              <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-white/10 flex items-center gap-1 z-10 pointer-events-none">
                <ImageIcon className="w-3 h-3" />
                +{extraCount}
              </div>
            )}

            {/* Gradient Overlay (only on desktop) */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          </div>

          {/* Content */}
          <div className="p-3 md:p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm md:text-lg font-bold text-neutral-900 mb-1 md:mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
              
              <div className="mt-1 md:mt-2">
                <p className="text-base md:text-2xl font-extrabold text-neutral-900 tracking-tight">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sell_price)}
                </p>
                {item.original_price && (
                  <p className="text-[10px] md:text-sm text-neutral-500 line-through mt-0.5 md:mt-1">
                    Giá gốc: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-3 md:mt-auto md:pt-4" onClick={(e) => e.stopPropagation()}>
              {item.affiliate_link ? (
                <Link 
                  href={item.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden flex items-center justify-center gap-1.5 w-full py-1.5 px-3 md:py-2.5 md:px-4 rounded-lg md:rounded-xl bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group-hover:shadow-[0_4px_14px_rgba(37,99,235,0.2)]"
                >
                  <Store className="w-3.5 h-3.5 md:w-5 md:h-5 relative z-10" />
                  <span className="text-[11px] md:text-sm font-bold relative z-10">Check giá trên sàn</span>
                  <div className="absolute inset-0 -top-[20px] flex h-[150%] w-8 animate-sweep bg-blue-400/20 rotate-[20deg] blur-[2px] z-0 mix-blend-overlay group-hover:bg-white/40" />
                </Link>
              ) : (
                <div className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 md:py-2.5 md:px-4 rounded-lg md:rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-400 cursor-not-allowed">
                  <span className="text-[11px] md:text-sm font-semibold">Không có link sàn</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ImageGallery>
    </div>
  )
}
