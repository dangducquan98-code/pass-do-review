'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ImageGalleryProps = {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // 1 for next, -1 for prev

  const hasImages = images && images.length > 0
  const firstImage = hasImages ? images[0] : null
  const extraCount = hasImages ? images.length - 1 : 0

  if (!hasImages) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-medium bg-neutral-100">
        Không ảnh
      </div>
    )
  }

  const openLightbox = () => {
    setIsOpen(true)
    setCurrentIndex(0)
    setDirection(0)
    document.body.style.overflow = 'hidden' // Prevent background scrolling
  }

  const closeLightbox = () => {
    setIsOpen(false)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null)
    setTouchStart(e.clientX)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX)
    }
  }

  const onMouseUp = () => {
    onTouchEndAction()
    setTouchStart(null)
    setTouchEnd(null)
  }

  const onTouchEndAction = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && images.length > 1) {
      nextImage()
    }
    if (isRightSwipe && images.length > 1) {
      prevImage()
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <>
      {/* Thumbnail View (Inside Product Card) */}
      <div 
        className="relative w-full h-full cursor-pointer group/gallery"
        onClick={openLightbox}
      >
        <Image 
          src={firstImage!} 
          alt={alt} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          sizes="(max-width: 768px) 40vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay on hover to indicate clickability */}
        <div className="absolute inset-0 bg-black/0 group-hover/gallery:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover/gallery:opacity-100 transform scale-90 group-hover/gallery:scale-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-neutral-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Xem ảnh
          </div>
        </div>

        {/* Extra Images Badge */}
        {extraCount > 0 && (
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-white/10 flex items-center gap-1 z-10">
            <ImageIcon className="w-3 h-3" />
            +{extraCount}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl">
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div 
            className="relative w-full max-w-5xl h-[80vh] md:h-[90vh] mx-4 flex items-center justify-center overflow-hidden touch-pan-y select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndAction}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image 
                  src={images[currentIndex]} 
                  alt={`${alt} - Ảnh ${currentIndex + 1}`} 
                  fill 
                  className="object-contain pointer-events-none" 
                  sizes="100vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons (Only show if multiple images) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-50"
                title="Ảnh trước"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-50"
                title="Ảnh tiếp"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-neutral-900/50 backdrop-blur-md rounded-full border border-white/10 z-[200]">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'bg-white scale-125' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  )
}
