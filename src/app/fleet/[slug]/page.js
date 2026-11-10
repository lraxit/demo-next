import { notFound } from 'next/navigation'
import { cars } from '../../data/vehicles.js'

export default async function VehiclePage({ params }) {
  const { slug } = await params

  if (!Object.hasOwn(cars, slug)) {
    notFound()
  }

  const car = cars[slug]

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold">{car.model}</h1>

      <img src={car.thumbnailImage} alt={car.model} className="my-8 h-80 w-full object-contain" />

      <p className="text-lg text-gray-600">{car.description}</p>
    </main>
  )
}
