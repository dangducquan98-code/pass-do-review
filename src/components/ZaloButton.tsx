'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function ZaloButton() {
  const zaloUrl = 'https://zalo.me/0976014798'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <div className="bg-white px-4 py-2 text-sm font-semibold text-neutral-800 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-neutral-100 animate-bounce">
        Liên hệ mua hàng
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-neutral-100 transform rotate-45"></div>
      </div>
      
      {/* Button */}
      <Link
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-[0_4px_14px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110"
      >
        {/* Simple Zalo Logo using text since we don't have an SVG handy, or use a chat icon */}
        <span className="text-white font-extrabold text-xl tracking-tighter">Zalo</span>
        
        {/* Pulsing rings effect */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-50 animate-ping"></div>
      </Link>
    </div>
  )
}
