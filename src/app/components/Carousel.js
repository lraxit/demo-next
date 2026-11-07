'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

export default function Carousel({ cards = [], autoScroll = true, speed = 0.7, resumeDelay = 0, wheelAxis = 'x' }) {
  const timer = useRef(null)
  const dragging = useRef(false)
  const keyboardFocus = useRef(false)

  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const plugins = useMemo(
    () => [
      AutoScroll({
        speed,
        startDelay: 800,
        defaultInteraction: false,
      }),
      WheelGesturesPlugin({
        forceWheelAxis: wheelAxis === 'y' ? 'y' : 'x',
      }),
    ],
    [speed, wheelAxis],
  )

  const [ref, api] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      dragThreshold: 15,
      focus: false,
    },
    plugins,
  )

  const stop = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = null
    api?.plugins().autoScroll?.stop()
  }, [api])

  const play = useCallback(() => {
    if (
      !api ||
      !autoScroll ||
      paused ||
      reducedMotion ||
      dragging.current ||
      keyboardFocus.current ||
      api.snapList().length <= 1
    )
      return

    api.plugins().autoScroll?.play(800)
  }, [api, autoScroll, paused, reducedMotion])

  const resumeSoon = useCallback(() => {
    clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      timer.current = null
      play()
    }, resumeDelay)
  }, [play, resumeDelay])

  // Respect the user's reduced-motion setting.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)

    update()
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  // Initialize and recover after layout changes.
  useEffect(() => {
    if (!api) return

    const sync = () => {
      if (!autoScroll || paused || reducedMotion) {
        api.plugins().autoScroll?.stop()
      } else if (!timer.current) {
        play()
      }
    }

    sync()
    api.on('reinit', sync)

    return () => {
      clearTimeout(timer.current)
      timer.current = null
      api.off('reinit', sync)
    }
  }, [api, autoScroll, paused, reducedMotion, play])

  // Resume even when dragging ends outside the carousel.
  useEffect(() => {
    const release = () => {
      if (!dragging.current) return

      dragging.current = false
      resumeSoon()
    }

    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)

    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [resumeSoon])

  const handlePointerDown = (event) => {
    dragging.current = true
    stop()

    // Let buttons and links receive clicks without starting a drag.
    if (event.target.closest('button, a, input, select, textarea')) {
      event.stopPropagation()
    }
  }

  const handleWheel = (event) => {
    const delta = wheelAxis === 'y' ? event.deltaY : event.deltaX
    if (!delta) return

    stop()
    resumeSoon()
  }

  return (
    <section className="w-full" aria-label="Content carousel">
      <div
        ref={ref}
        className="overflow-hidden touch-pan-y"
        onPointerDownCapture={handlePointerDown}
        onWheelCapture={handleWheel}
        onFocusCapture={(event) => {
          if (event.target.matches(':focus-visible')) {
            keyboardFocus.current = true
            stop()
          }
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            keyboardFocus.current = false
            resumeSoon()
          }
        }}
      >
        <div className="flex items-stretch">
          {cards.map((card, index) => (
            <div
              key={card.key ?? index}
              className="flex min-w-0 shrink-0 basis-full p-3 sm:basis-[85%] md:basis-[52%] xl:basis-[32%]"
            >
              {card}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
