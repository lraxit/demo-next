import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function VehicleCard({ car }) {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md transition-shadow hover:shadow-lg">
      {/* Vehicle Image */}
      <div className="flex h-60 items-center justify-center bg-gradient-to-b from-stone-50 to-white p-6">
        <img src={car.thumbnailImage} alt={car.model} draggable={false} className="h-full w-full object-contain" />
      </div>

      {/* Vehicle Information */}
      <div className="flex flex-1 items-end gap-4 p-6 pt-2">
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-950">{car.model}</h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">{car.description}</p>
        </div>

        {/* Button — no action yet */}
        <button
          type="button"
          aria-label={`View ${car.model}`}
          className="w-40 grid size-12 shrink-0 place-items-center rounded-full border border-stone-300 text-stone-900 transition-colors hover:cursor-pointer hover:bg-stone-900 hover:text-white"
        >
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
    </article>
  )
}
