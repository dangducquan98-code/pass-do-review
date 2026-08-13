'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function AnimatedHero() {
  return (
    <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-neutral-200 overflow-hidden">
      
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
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200/80 text-blue-600 text-xs font-semibold mb-6 shadow-[0_2px_10px_rgba(37,99,235,0.1)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Đồ Review Thanh Lý</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 to-neutral-500"
        >
          Săn Đồ Giá Rẻ, Chất Lượng Như Mới
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-4 text-sm md:text-lg text-neutral-500 max-w-lg mx-auto font-medium"
        >
          100% hàng mới, chỉ unbox quay video rồi đóng gói lại cẩn thận.
        </motion.p>
      </div>
    </section>
  )
}
