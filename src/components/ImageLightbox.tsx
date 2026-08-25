'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ImageLightboxProps = {
  images: string[]
  alt: string
  currentIndex: number
  direction: number
  onClose: (e?: React.MouseEvent) => void
  onNext: () => void
  onPrev: () => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    zIndex: 0,
    x: dir < 0 ? 1000 : -1000,
    opacity: 0,
  }),
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function ImageLightbox({
  images,
  alt,
  currentIndex,
  direction,
  onClose,
  onNext,
  onPrev,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null

    const dialog = dialogRef.current
    const getFocusable = () =>
      dialog
        ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        : []

    const focusable = getFocusable()
    focusable[0]?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'ArrowRight' && images.length > 1) {
        onNext()
        return
      }

      if (e.key === 'ArrowLeft' && images.length > 1) {
        onPrev()
        return
      }

      if (e.key !== 'Tab') return

      const nodes = getFocusable()
      if (nodes.length === 0) {
        e.preventDefault()
        return
      }

      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [images.length, onClose, onNext, onPrev])

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Xem ảnh: ${alt}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex items-center justify-between z-50 pointer-events-none">
        <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-bold border border-white/10 shadow-sm pointer-events-auto">
          Ảnh {currentIndex + 1} / {images.length}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur-md pointer-events-auto shadow-sm"
          title="Đóng (ESC)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div
        className="relative w-full max-w-5xl h-[80vh] md:h-[90vh] mx-4 flex items-center justify-center overflow-hidden touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={images[currentIndex]}
              alt={`${alt} - Ảnh ${currentIndex + 1}`}
              fill
              className="object-contain pointer-events-none"
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={75}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Ảnh trước"
            className="absolute left-2 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-50"
            title="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Ảnh tiếp"
            className="absolute right-2 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-50"
            title="Ảnh tiếp"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-neutral-900/50 backdrop-blur-md rounded-full border border-white/10 z-[200]">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>,
    document.body
  )
}
