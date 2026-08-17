'use client'

import { motion, Variants } from 'framer-motion'
import ProductCard from './ProductCard'

type Item = {
  id: string
  name: string
  original_price: number | null
  sell_price: number
  status: string
  images: string[]
  affiliate_link: string | null
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function AnimatedProductGrid({ 
  items, 
  emptyMessage 
}: { 
  items: Item[]
  emptyMessage?: string 
}) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-16 md:p-20 bg-white/70 backdrop-blur-md border border-neutral-200 border-dashed rounded-3xl shadow-sm">
        <p className="text-neutral-500 text-base md:text-lg font-medium">
          {emptyMessage || 'Hiện tại không có món đồ nào. Bạn quay lại sau nhé!'}
        </p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
    >
      {items.map((item, index) => (
        <motion.div key={item.id} variants={itemVariant} className="h-full">
          <ProductCard item={item} priority={index < 4} />
        </motion.div>
      ))}
    </motion.div>
  )
}
