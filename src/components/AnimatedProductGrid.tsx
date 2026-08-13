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

export default function AnimatedProductGrid({ items }: { items: Item[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-20 bg-white border border-neutral-200 border-dashed rounded-3xl shadow-sm">
        <p className="text-neutral-500 text-lg">Hiện tại không có món đồ nào đang pass. <br/>Bạn quay lại sau nhé!</p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariant} className="h-full">
          <ProductCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  )
}
