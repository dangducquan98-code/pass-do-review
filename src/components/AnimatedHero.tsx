'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Marquee from './Marquee'

export default function AnimatedHero() {
  return (
    <section className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-neutral-200 overflow-hidden">
      
      {/* Subtle Animated Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Animated Radial Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200/80 text-blue-600 text-[10px] sm:text-xs font-semibold mb-4 shadow-[0_2px_10px_rgba(37,99,235,0.1)]"
        >
          <Sparkles className="w-3 h-3" />
          <span>Đồ Review Thanh Lý</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-[15px] sm:text-2xl md:text-4xl font-black tracking-tight animate-shimmer bg-[linear-gradient(110deg,#171717,45%,#a3a3a3,55%,#171717)] bg-[length:200%_100%] bg-clip-text text-transparent whitespace-nowrap"
        >
          Săn Đồ Giá Rẻ, Chất Lượng Như Mới
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-3 text-[11px] sm:text-sm md:text-lg text-neutral-500 max-w-lg mx-auto font-medium"
        >
          100% hàng mới, chỉ unbox quay video rồi đóng gói lại cẩn thận.
        </motion.p>
      </div>

      {/* Trust Marquee */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-8 md:mt-12 relative z-10 border-t border-b border-neutral-200/50 bg-white/50 backdrop-blur-md py-2.5 md:py-3"
      >
        <Marquee className="text-[11px] sm:text-sm font-bold text-neutral-600">
          <span className="mx-3 flex items-center gap-1.5 whitespace-nowrap"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Ảnh thực tế tự chụp</span>
          <span className="mx-3 text-neutral-300">•</span>
          <span className="mx-3 flex items-center gap-1.5 whitespace-nowrap"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Freeship nội thành</span>
          <span className="mx-3 text-neutral-300">•</span>
          <span className="mx-3 flex items-center gap-1.5 whitespace-nowrap"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Hàng mới 100%</span>
          <span className="mx-3 text-neutral-300">•</span>
          <span className="mx-3 flex items-center gap-1.5 whitespace-nowrap"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Rẻ hơn sàn ít nhất 20%</span>
          <span className="mx-3 text-neutral-300">•</span>
          <span className="mx-3 flex items-center gap-1.5 whitespace-nowrap"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Hoàn tiền nếu hàng lỗi</span>
          <span className="mx-3 text-neutral-300">•</span>
        </Marquee>
      </motion.div>
    </section>
  )
}
