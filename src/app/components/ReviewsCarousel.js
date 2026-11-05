'use client'

import { useEffect, useState } from 'react'
import { ReactGoogleReviews } from 'react-google-reviews'
import 'react-google-reviews/dist/index.css'

export default function ReviewsCarousel({ reviews, averageRating, totalReviewCount }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <p>Loading reviews...</p>
  }

  return (
    <ReactGoogleReviews
      layout="carousel"
      reviews={reviews}
      averageRating={averageRating}
      totalReviewCount={totalReviewCount}
      structuredData={false}
    />
  )
}
