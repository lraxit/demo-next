import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function VehicleCard({ car, priority = false }) {
  return (
    <article className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md sm:rounded-3xl">
      {/* Vehicle image */}
      <div className="flex h-44 items-center justify-center bg-gradient-to-b from-stone-50 to-white px-4 pt-4 sm:h-56 sm:px-6 sm:pt-6">
        <img
          src={car.thumbnailImage}
          alt={car.model}
          draggable={false}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Vehicle information */}
      <div className="flex-1 p-5">
        <h2 className="font-serif text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">{car.model}</h2>

        <p className="mt-2 text-sm leading-6 text-stone-600">{car.description}</p>
      </div>

      {/* Full-width bottom button */}
      <button
        type="button"
        className="mx-2 mb-2 flex min-h-14 active:bg-stone-200 items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-all hover:cursor-pointer hover:bg-stone-400 hover:text-white"
      >
        View details
        <ArrowRightIcon className="size-5 shrink-0" />
      </button>
    </article>
  )
}
