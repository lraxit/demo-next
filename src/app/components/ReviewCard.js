'use client'

import { useEffect, useRef, useState } from 'react'

export default function ReviewCard({ profileImage, name = 'Anonymous', stars = 5, date, description = '' }) {
  const [expanded, setExpanded] = useState(false)
  const [truncated, setTruncated] = useState(false)
  const containerRef = useRef(null)
  const measureRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const check = () => {
      setTruncated(measure.scrollHeight > 120)
    }

    const observer = new ResizeObserver(check)
    observer.observe(container)
    check()

    return () => observer.disconnect()
  }, [description])

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <article className="flex w-full flex-1 flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center gap-3">
        {profileImage ? (
          <img src={profileImage} alt="" className="size-11 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-stone-900">{name}</h3>
          <p className="text-xs text-slate-500">
            {date &&
              new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
          </p>
        </div>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
          alt="Google"
          className="size-6 shrink-0"
        />
      </div>

      <div className="mb-3 flex gap-1">
        <span className="text-amber-400">{'★'.repeat(stars)}</span>
        <span className="text-gray-300">{'★'.repeat(5 - stars)}</span>
      </div>

      <div ref={containerRef} className="relative">
        <p
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute inset-x-0 top-0 text-sm leading-6 whitespace-pre-wrap"
        >
          {description}
        </p>

        <p className={`text-sm leading-6 whitespace-pre-wrap text-slate-700 ${expanded ? '' : 'line-clamp-5'}`}>
          {description}
        </p>

        {truncated && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 cursor-pointer text-sm font-medium text-indigo-600 hover:underline"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </article>
  )
}
