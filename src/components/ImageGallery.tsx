'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'

const ImageLightbox = dynamic(() => import('./ImageLightbox'), { ssr: false })

type ImageGalleryProps = {
  images: string[]
  alt: string
  children?: React.ReactNode
}

export default function ImageGallery({ images, alt, children }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const hasImages = images && images.length > 0
  const firstImage = hasImages ? images[0] : null
  const extraCount = hasImages ? images.length - 1 : 0

  const openLightbox = () => {
    setIsOpen(true)
    setCurrentIndex(0)
    setDirection(0)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setIsOpen(false)
    document.body.style.overflow = 'auto'
  }, [])

  const nextImage = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const prevImage = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const minSwipeDistance = 50

  // Toạ độ vuốt lưu trong ref: không cần re-render ở mỗi touchmove/mousemove.
  const touchStart = useRef<number | null>(null)
  const touchEnd = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null
    touchStart.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX
  }

  const onMouseDown = (e: React.MouseEvent) => {
    touchEnd.current = null
    touchStart.current = e.clientX
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart.current !== null) {
      touchEnd.current = e.clientX
    }
  }

  const onTouchEndAction = () => {
    const start = touchStart.current
    const end = touchEnd.current
    touchStart.current = null
    touchEnd.current = null
    if (start === null || end === null) return

    const distance = start - end
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && images.length > 1) {
      nextImage()
    }
    if (isRightSwipe && images.length > 1) {
      prevImage()
    }
  }

  const onMouseUp = onTouchEndAction

  if (!hasImages) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-medium bg-neutral-100">
        Không ảnh
      </div>
    )
  }

  return (
    <>
      {children ? (
        <div onClick={openLightbox} className="cursor-pointer h-full w-full">
          {children}
        </div>
      ) : (
        <div
          className="relative w-full h-full cursor-pointer group/gallery"
          onClick={openLightbox}
        >
          <Image
            src={firstImage!}
            alt={alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 110px, (max-width: 1200px) 33vw, 25vw"
            quality={65}
          />

          <div className="absolute inset-0 bg-black/0 group-hover/gallery:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover/gallery:opacity-100 transform scale-90 group-hover/gallery:scale-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-neutral-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Xem ảnh
            </div>
          </div>

          {extraCount > 0 && (
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-white/10 flex items-center gap-1 z-10">
              <ImageIcon className="w-3 h-3" />
              +{extraCount}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <ImageLightbox
          images={images}
          alt={alt}
          currentIndex={currentIndex}
          direction={direction}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndAction}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        />
      )}
    </>
  )
}
