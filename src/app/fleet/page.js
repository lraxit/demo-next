import cars from './vehicles.js'
import VehicleCard from './VehicleCard.js'
import Carousel from '../components/Carousel.js'

export default function Fleet() {
  return (
    <div className="p-12">
      {/* Cars body */}
      <div className="flex">
        <Carousel
          cards={cars().map((car, index) => (
            <VehicleCard key={index} car={car} />
          ))}
        />
      </div>

      <h1>Fleet Page</h1>
    </div>
  )
}
