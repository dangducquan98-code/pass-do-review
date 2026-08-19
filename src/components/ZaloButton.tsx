'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ZaloButton() {
  const zaloUrl = 'https://zalo.me/0976014798'

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
    >
      <Link
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 bg-neutral-950/92 hover:bg-neutral-950 backdrop-blur-2xl rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_40px_rgba(37,99,235,0.25)] border border-white/15 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-full flex-shrink-0 shadow-sm">
            <span className="text-white font-black text-[10px] sm:text-[11px] tracking-tighter">Zalo</span>
            <div className="absolute inset-0 rounded-full border border-blue-400 opacity-60 animate-ping"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-xs sm:text-sm">Nhắn Zalo chốt đơn</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-neutral-400 text-[10px] sm:text-xs font-medium">Hỗ trợ 9h - 23h • 0976.014.798</span>
          </div>
        </div>
        
        <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-bold rounded-full transition-colors flex-shrink-0 shadow-xs">
          Chat ngay
        </div>
      </Link>
    </motion.div>
  )
}
