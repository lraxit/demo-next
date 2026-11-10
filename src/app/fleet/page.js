import { cars } from '../data/vehicles.js'
import VehicleCard from '../components/VehicleCard.js'
import Carousel from '../components/Carousel.js'

export default function Fleet() {
  return (
    <div className="p-12">
      {/* Cars body */}
      <div className="flex">
        <Carousel
          cards={Object.entries(cars).map(([slug, car]) => (
            <VehicleCard key={slug} slug={slug} car={car} />
          ))}
        />
      </div>

      <h1>Fleet Page</h1>
    </div>
  )
}
