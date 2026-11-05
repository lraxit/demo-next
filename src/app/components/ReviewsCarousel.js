'use client'

import { useEffect, useState } from 'react'
import { ReactGoogleReviews } from 'react-google-reviews'
import 'react-google-reviews/dist/index.css'

export default function ReviewsCarousel({ reviews, averageRating, totalReviewCount }) {
  const [mounted, setMounted] = useState(false)
  const [maxItems, setMaxItems] = useState(1)

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth

      setMaxItems(width >= 1024 ? 3 : width >= 640 ? 2 : 1)
    }

    updateLayout()
    setMounted(true)

    window.addEventListener('resize', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
    }
  }, [])

  if (!mounted) {
    return <div className="h-64" />
  }

  return (
    <section className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 py-8 overflow-hidden">
      <ReactGoogleReviews
        key={maxItems}
        layout="carousel"
        reviews={reviews}
        averageRating={averageRating}
        totalReviewCount={totalReviewCount}
        maxItems={maxItems}
        maxCharacters={180}
        carouselAutoplay={false}
        showDots={true}
        structuredData={false}
      />
    </section>
  )
}
