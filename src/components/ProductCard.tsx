import Link from 'next/link'
import { Store } from 'lucide-react'
import ImageGallery from './ImageGallery'

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
  
  return (
    <div className="group relative bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-row md:flex-col h-full shadow-sm">
      {/* Image Container */}
      <div className="relative w-[110px] md:w-full md:aspect-square overflow-hidden bg-neutral-100 flex-shrink-0 border-r md:border-r-0 md:border-b border-neutral-200 self-stretch">
        <ImageGallery images={item.images} alt={item.name} />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
          <span className={`px-2 py-0.5 md:px-3 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold tracking-wide backdrop-blur-md border shadow-sm ${
            isAvailable 
              ? 'bg-blue-50/90 text-blue-700 border-blue-200' 
              : 'bg-white/90 text-neutral-500 border-neutral-200'
          }`}>
            {isAvailable ? 'CÒN HÀNG' : 'ĐÃ BÁN'}
          </span>
        </div>

        {/* Gradient Overlay (only on desktop) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60"></div>
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
        
        <div className="mt-3 md:mt-auto md:pt-4">
          {item.affiliate_link ? (
            <Link 
              href={item.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 md:py-2.5 md:px-4 rounded-lg md:rounded-xl bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group-hover:shadow-[0_4px_14px_rgba(37,99,235,0.2)]"
            >
              <Store className="w-3.5 h-3.5 md:w-5 md:h-5" />
              <span className="text-[11px] md:text-sm font-bold">Check giá trên sàn</span>
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 md:py-2.5 md:px-4 rounded-lg md:rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-400 cursor-not-allowed">
              <span className="text-[11px] md:text-sm font-semibold">Không có link sàn</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
