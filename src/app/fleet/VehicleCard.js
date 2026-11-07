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
      <div className="flex flex-1 flex-col p-4 pt-3 sm:p-6 sm:pt-3">
        <div className="min-w-0">
          <h2 className="font-serif text-xl font-bold tracking-tight text-stone-950 sm:text-2xl">{car.model}</h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">{car.description}</p>
        </div>

        {/* Button — no functionality yet */}
        <button
          type="button"
          aria-label={`View ${car.model} details`}
          className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 self-end rounded-full border border-stone-300 px-4 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-900 hover:text-white sm:mt-auto sm:size-12 sm:w-12 sm:p-0"
        >
          <span className="sm:sr-only">View details</span>
          <ArrowRightIcon className="size-5 shrink-0" />
        </button>
      </div>
    </article>
  )
}
