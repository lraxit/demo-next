'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const MAX_CHARACTERS = 180

// Get the width of one review card, including its gap
function getSlideWidth(carousel) {
  const card = carousel.querySelector('[data-review-card]')
  if (!card) return 0

  const gap = parseFloat(window.getComputedStyle(carousel).columnGap) || 0

  return card.getBoundingClientRect().width + gap
}

// Reposition without a visible animation
function jumpWithoutAnimation(carousel, position) {
  const oldSnap = carousel.style.scrollSnapType
  const oldBehavior = carousel.style.scrollBehavior

  carousel.style.scrollSnapType = 'none'
  carousel.style.scrollBehavior = 'auto'
  carousel.scrollLeft = position

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      carousel.style.scrollSnapType = oldSnap
      carousel.style.scrollBehavior = oldBehavior
    })
  })
}

// Google gradient logo
function GoogleIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
      alt="Google"
      width={26}
      height={26}
      className="h-[26px] w-[26px] object-contain"
    />
  )
}

export default function ReviewsCarousel({
  reviews = [],
  averageRating,
  totalReviewCount,
  autoScroll = true,
  autoScrollInterval = 5000,
  minStars = 4,
}) {
  const carouselRef = useRef(null)

  const [expanded, setExpanded] = useState({})
  const [isPaused, setIsPaused] = useState(false)
  const [navigationKey, setNavigationKey] = useState(0)

  // Filter reviews by minimum star rating
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => Number(review.starRating) >= minStars)
  }, [reviews, minStars])

  // Duplicate reviews for infinite looping
  const loopedReviews = useMemo(() => {
    if (filteredReviews.length <= 1) {
      return filteredReviews
    }

    return [...filteredReviews, ...filteredReviews, ...filteredReviews]
  }, [filteredReviews])

  // Pause autoplay if a review is expanded
  const hasExpandedReview = filteredReviews.some((review, index) => expanded[review.reviewId ?? String(index)])

  // Scroll by one review card
  const scroll = useCallback((direction) => {
    const carousel = carouselRef.current
    if (!carousel) return

    const distance = getSlideWidth(carousel)
    if (!distance) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    carousel.scrollBy({
      left: direction * distance,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }, [])

  // Initialize and maintain the infinite carousel
  useLayoutEffect(() => {
    const carousel = carouselRef.current
    const count = filteredReviews.length

    if (!carousel) return

    if (count <= 1) {
      carousel.scrollLeft = 0
      return
    }

    const getGroupWidth = () => {
      return getSlideWidth(carousel) * count
    }

    // Start on the middle copy of the reviews
    const centerCarousel = () => {
      const groupWidth = getGroupWidth()

      if (groupWidth > 0) {
        jumpWithoutAnimation(carousel, groupWidth)
      }
    }

    // Invisibly reposition to matching reviews
    const resetLoop = () => {
      const groupWidth = getGroupWidth()
      if (!groupWidth) return

      const position = carousel.scrollLeft

      if (position >= groupWidth * 2 - 2) {
        jumpWithoutAnimation(carousel, position - groupWidth)
      } else if (position < groupWidth - 2) {
        jumpWithoutAnimation(carousel, position + groupWidth)
      }
    }

    centerCarousel()

    let scrollTimer

    const handleScroll = () => {
      window.clearTimeout(scrollTimer)

      scrollTimer = window.setTimeout(() => {
        resetLoop()
      }, 180)
    }

    carousel.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    carousel.addEventListener('scrollend', resetLoop)

    // Recalculate when the screen changes size
    let previousWidth = carousel.clientWidth
    let previousSlideWidth = getSlideWidth(carousel)

    const observer = new ResizeObserver(() => {
      const currentWidth = carousel.clientWidth
      const currentSlideWidth = getSlideWidth(carousel)

      if (currentWidth !== previousWidth || Math.abs(currentSlideWidth - previousSlideWidth) > 0.5) {
        previousWidth = currentWidth
        previousSlideWidth = currentSlideWidth

        centerCarousel()
      }
    })

    observer.observe(carousel)

    const firstCard = carousel.querySelector('[data-review-card]')

    if (firstCard) {
      observer.observe(firstCard)
    }

    return () => {
      window.clearTimeout(scrollTimer)

      carousel.removeEventListener('scroll', handleScroll)
      carousel.removeEventListener('scrollend', resetLoop)

      observer.disconnect()
    }
  }, [filteredReviews.length, minStars])

  // Automatically advance the carousel
  useEffect(() => {
    if (!autoScroll || isPaused || hasExpandedReview || filteredReviews.length <= 1) {
      return
    }

    // Respect reduced-motion accessibility settings
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const interval = window.setInterval(
      () => {
        scroll(1)
      },
      Math.max(1500, autoScrollInterval),
    )

    return () => {
      window.clearInterval(interval)
    }
  }, [autoScroll, autoScrollInterval, isPaused, hasExpandedReview, filteredReviews.length, navigationKey, scroll])

  // Handle manual arrow navigation
  const handleNavigation = (direction) => {
    scroll(direction)

    // Restart autoplay timer
    setNavigationKey((prev) => prev + 1)
  }

  // Expand or collapse individual reviews
  const toggleReview = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <section
      className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false)
        }
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">What Our Customers Are Saying</h2>

        <p className="mt-1 text-sm text-gray-500">
          {averageRating != null && `${averageRating} / 5`}
          {totalReviewCount != null && ` · ${totalReviewCount} Google reviews`}
        </p>
      </div>

      {/* Empty state */}
      {filteredReviews.length === 0 && (
        <p className="py-8 text-center text-gray-500">No reviews meet the minimum rating of {minStars} stars.</p>
      )}

      {/* Infinite carousel with centered arrows */}
      {filteredReviews.length > 0 && (
        <div className="relative group">
          {/* Previous arrow */}
          <button
            type="button"
            aria-label="Previous review"
            disabled={filteredReviews.length <= 1}
            onClick={() => handleNavigation(-1)}
            className="
              absolute left-2 top-1/2 z-20
              flex h-11 w-11
              -translate-y-1/2
              items-center justify-center
              rounded-full border border-gray-200
              bg-white text-gray-700 shadow-lg
              transition-all duration-200
              hover:scale-110 hover:bg-gray-100
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
              sm:left-0 sm:-translate-x-1/2
            "
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          {/* Review cards */}
          <div
            ref={carouselRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Customer reviews"
            aria-live="off"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {loopedReviews.map((review, index) => {
              const id = review.reviewId ?? String(index % filteredReviews.length)

              const text = review.comment || ''
              const isExpanded = Boolean(expanded[id])
              const canExpand = text.length > MAX_CHARACTERS

              const displayedText = isExpanded || !canExpand ? text : text.slice(0, MAX_CHARACTERS).trimEnd() + '…'

              const reviewerName = review.reviewer?.displayName || 'Anonymous'

              const profilePhoto = review.reviewer?.profilePhotoUrl

              const rating = Math.max(0, Math.min(5, Math.round(review.starRating || 0)))

              const date = review.createTime ? new Date(review.createTime) : null

              const dateLabel =
                date && !Number.isNaN(date.getTime())
                  ? date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })
                  : ''

              return (
                <article
                  key={`${index}-${id}`}
                  data-review-card
                  className="
                    relative box-border w-full shrink-0 snap-start
                    rounded-2xl border border-gray-200
                    bg-white p-6 shadow-sm
                    transition-shadow hover:shadow-md
                    sm:w-[calc((100%_-_1rem)/2)]
                    lg:w-[calc((100%_-_2rem)/3)]
                  "
                >
                  {/* Google logo */}
                  <div className="absolute right-5 top-5">
                    <GoogleIcon />
                  </div>

                  {/* Reviewer information */}
                  <div className="flex items-center gap-3 pr-9">
                    {/* Profile picture */}
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-semibold text-gray-600">
                      <span>{reviewerName.charAt(0).toUpperCase()}</span>

                      {profilePhoto && (
                        <img
                          src={profilePhoto}
                          alt={`${reviewerName}'s profile`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                    </div>

                    {/* Name and date */}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{reviewerName}</p>

                      <p className="text-sm text-gray-500">{dateLabel}</p>
                    </div>
                  </div>

                  {/* Star rating */}
                  <div className="mt-4 flex gap-0.5 text-xl" aria-label={`${review.starRating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} aria-hidden="true" className={i < rating ? 'text-amber-500' : 'text-gray-200'}>
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">{displayedText}</p>

                  {/* Read more / Read less */}
                  {canExpand && (
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => toggleReview(id)}
                      className="
                        mt-3 cursor-pointer font-medium
                        text-blue-600 transition-colors
                        hover:text-blue-800 hover:underline
                      "
                    >
                      {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </article>
              )
            })}
          </div>

          {/* Next arrow */}
          <button
            type="button"
            aria-label="Next review"
            disabled={filteredReviews.length <= 1}
            onClick={() => handleNavigation(1)}
            className="
              absolute right-2 top-1/2 z-20
              flex h-11 w-11
              -translate-y-1/2
              items-center justify-center
              rounded-full border border-gray-200
              bg-white text-gray-700 shadow-lg
              transition-all duration-200
              hover:scale-110 hover:bg-gray-100
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
              sm:right-0 sm:translate-x-1/2
            "
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  )
}
