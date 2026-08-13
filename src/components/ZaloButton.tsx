'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ZaloButton() {
  const zaloUrl = 'https://zalo.me/0976014798'

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
    >
      <Link
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-between px-6 py-3.5 bg-neutral-900/90 hover:bg-neutral-900 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/10 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
            <span className="text-white font-black text-[10px] tracking-tighter">Zalo</span>
            <div className="absolute inset-0 rounded-full border border-blue-400 opacity-50 animate-ping"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm">Nhắn Zalo chốt đơn</span>
            <span className="text-neutral-400 text-xs font-medium">Hỗ trợ 9h00 - 23h00 (0976014798)</span>
          </div>
        </div>
        
        <div className="px-3 py-1.5 bg-white/10 text-white text-xs font-bold rounded-full group-hover:bg-white/20 transition-colors">
          Chat ngay
        </div>
      </Link>
    </motion.div>
  )
}
