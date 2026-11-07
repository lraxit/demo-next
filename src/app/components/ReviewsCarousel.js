'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

const GOOGLE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg'

function getSlideStep(carousel) {
  const card = carousel?.querySelector('[data-review-card]')
  if (!card) return 0

  const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0
  return card.getBoundingClientRect().width + gap
}

function jumpTo(carousel, left) {
  const originalSnap = carousel.style.scrollSnapType
  const originalBehavior = carousel.style.scrollBehavior
  carousel.style.scrollSnapType = 'none'
  carousel.style.scrollBehavior = 'auto'
  carousel.scrollLeft = left

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      carousel.style.scrollSnapType = originalSnap
      carousel.style.scrollBehavior = originalBehavior
    })
  })
}

function Arrow({ direction, onClick, disabled, className = '' }) {
  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon

  return (
    <button
      type="button"
      aria-label={direction === 'previous' ? 'Previous review' : 'Next review'}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}

export default function ReviewsCarousel({
  reviews = [],
  averageRating,
  totalReviewCount,
  autoScroll,
  autoScrollInterval,
  minStars,
  previewCharacters = 145,
}) {
  const carouselRef = useRef(null)
  const indexRef = useRef(0)
  const [expanded, setExpanded] = useState({})
  const [hovered, setHovered] = useState(false)
  const [touching, setTouching] = useState(false)
  const [focused, setFocused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [navigationKey, setNavigationKey] = useState(0)

  const filteredReviews = useMemo(
    () => reviews.filter((review) => Number(review.starRating) >= minStars),
    [reviews, minStars],
  )

  const count = filteredReviews.length
  const loopedReviews = useMemo(
    () => (count > 1 ? [...filteredReviews, ...filteredReviews, ...filteredReviews] : filteredReviews),
    [filteredReviews, count],
  )

  const hasExpandedReview = filteredReviews.some((review, i) => Boolean(expanded[review.reviewId ?? String(i)]))
  const isPaused = hovered || touching || focused || hasExpandedReview

  const scroll = useCallback((direction) => {
    const carousel = carouselRef.current
    if (!carousel) return
    const step = getSlideStep(carousel)
    if (!step) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    carousel.scrollBy({
      left: direction * step,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }, [])

  // Keep the center copy visible, allowing movement in either direction.
  useLayoutEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    indexRef.current = 0
    setCurrentIndex(0)
    if (count <= 1) {
      carousel.scrollLeft = 0
      return
    }

    const getGroupWidth = () => getSlideStep(carousel) * count
    const center = () => {
      const groupWidth = getGroupWidth()
      if (groupWidth) jumpTo(carousel, groupWidth)
    }

    const finalizeScroll = () => {
      const step = getSlideStep(carousel)
      const groupWidth = step * count
      if (!groupWidth) return
      let left = carousel.scrollLeft

      if (left >= 2 * groupWidth - step / 3) {
        left -= groupWidth
        jumpTo(carousel, left)
      } else if (left < groupWidth - step / 3) {
        left += groupWidth
        jumpTo(carousel, left)
      }

      const nextIndex = ((Math.round(left / step) % count) + count) % count
      indexRef.current = nextIndex
      setCurrentIndex(nextIndex)
    }

    center()
    let timer
    const handleScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(finalizeScroll, 180)
    }

    carousel.addEventListener('scroll', handleScroll, { passive: true })
    carousel.addEventListener('scrollend', finalizeScroll)

    // Preserve the same logical review when card widths change.
    let lastWidth = carousel.clientWidth
    let lastStep = getSlideStep(carousel)
    const observer = new ResizeObserver(() => {
      const width = carousel.clientWidth
      const step = getSlideStep(carousel)
      if (width !== lastWidth || Math.abs(step - lastStep) > 0.5) {
        lastWidth = width
        lastStep = step
        jumpTo(carousel, (count + indexRef.current) * step)
      }
    })
    observer.observe(carousel)
    const firstCard = carousel.querySelector('[data-review-card]')
    if (firstCard) observer.observe(firstCard)

    return () => {
      clearTimeout(timer)
      carousel.removeEventListener('scroll', handleScroll)
      carousel.removeEventListener('scrollend', finalizeScroll)
      observer.disconnect()
    }
  }, [count, filteredReviews])

  useEffect(() => {
    if (!autoScroll || isPaused || count <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => scroll(1), autoScrollInterval)
    return () => window.clearInterval(timer)
  }, [autoScroll, autoScrollInterval, isPaused, count, navigationKey, scroll])

  const navigate = (direction) => {
    scroll(direction)
    setNavigationKey((value) => value + 1)
  }

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="mx-auto w-full min-w-0 max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6 sm:py-12"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setTouching(true)}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div className="mb-5 sm:mb-7">
        <h2 id="reviews-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Customer Reviews
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {averageRating != null && (
            <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
              <span aria-hidden="true" className="text-amber-500">
                ★
              </span>
              {averageRating} / 5
            </span>
          )}
          {totalReviewCount != null && <span>· {totalReviewCount} Google reviews</span>}
        </div>
      </div>

      {count === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
          No reviews meet the minimum rating of {minStars} stars.
        </p>
      ) : (
        <>
          <div className="relative sm:mx-9">
            {/* Side arrows on tablet/desktop only. */}
            <Arrow
              direction="previous"
              disabled={count <= 1}
              onClick={() => navigate(-1)}
              className="absolute -left-12 top-1/2 z-10 hidden -translate-y-1/2 sm:flex"
            />

            <div
              ref={carouselRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Google customer reviews"
              aria-live="off"
              className="flex min-w-0 snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {loopedReviews.map((review, index) => {
                const originalIndex = index % count
                const id = review.reviewId ?? String(originalIndex)
                const name = review.reviewer?.displayName || 'Anonymous'
                const photo = review.reviewer?.profilePhotoUrl
                const reviewText = review.comment || ''
                const canExpand = reviewText.length > previewCharacters
                const isExpanded = Boolean(expanded[id])
                const text =
                  !canExpand || isExpanded ? reviewText : `${reviewText.slice(0, previewCharacters).trimEnd()}…`
                const rating = Math.min(5, Math.max(0, Math.round(Number(review.starRating) || 0)))
                const date = review.createTime ? new Date(review.createTime) : null
                const dateLabel =
                  date && !Number.isNaN(date.getTime())
                    ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
                    : ''

                return (
                  <article
                    key={`${index}-${id}`}
                    data-review-card
                    className="relative box-border w-full shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:w-[calc((100%_-_1rem)/2)] sm:p-6 lg:w-[calc((100%_-_2rem)/3)]"
                  >
                    <img
                      src={GOOGLE_LOGO}
                      alt="Google"
                      width="23"
                      height="23"
                      className="absolute right-5 top-5 h-[23px] w-[23px] object-contain"
                    />

                    <div className="flex min-w-0 items-center gap-3 pr-9">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                        {name.charAt(0).toUpperCase()}
                        {photo && (
                          <img
                            src={photo}
                            alt=""
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold leading-5 text-slate-900">{name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{dateLabel}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-0.5 text-lg" aria-label={`${review.starRating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, star) => (
                        <span
                          key={star}
                          aria-hidden="true"
                          className={star < rating ? 'text-amber-500' : 'text-slate-200'}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 whitespace-pre-line break-words text-base leading-7 text-slate-700">{text}</p>
                    {canExpand && (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => setExpanded((state) => ({ ...state, [id]: !state[id] }))}
                        className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </article>
                )
              })}
            </div>

            <Arrow
              direction="next"
              disabled={count <= 1}
              onClick={() => navigate(1)}
              className="absolute -right-12 top-1/2 z-10 hidden -translate-y-1/2 sm:flex"
            />
          </div>

          {/* Controls live BELOW the card on phones, never over text. */}
          <div className="mt-4 flex items-center justify-center gap-5 sm:hidden">
            <Arrow direction="previous" disabled={count <= 1} onClick={() => navigate(-1)} />
            <span className="min-w-14 text-center text-sm font-medium tabular-nums text-slate-600" aria-live="polite">
              {currentIndex + 1} / {count}
            </span>
            <Arrow direction="next" disabled={count <= 1} onClick={() => navigate(1)} />
          </div>
        </>
      )}
    </section>
  )
}
