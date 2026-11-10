import Reviews from './Reviews.js'
import Card from './Card'
import Content from './Content'
import Flex from './Flex'
import Carousel from './Carousel.js'

import { cars } from './../data/vehicles.js'
import VehicleCard from './VehicleCard.js'

const cards = [
  {
    title: 'Forest',
    img: 'https://media.posterstore.com/site_images/686301220b074212f55c7e81_126037353_PS52857-5.jpg',
    desc: "A forest is a complex ecosystem dominated by dense communities of trees, shrubs, and underbrush that cover roughly 30% to one-third of the Earth's land surface.",
    pills: ['photography', 'nature', 'cloudy'],
  },
  {
    title: 'Pyramid',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYWbsOA4LAi7SA9o7csnJk04bqh84lDZ510J9drgsJHw&s=10',
    desc: 'A pyramid is a monumental structure with a polygonal base and triangular sides that slope upward and meet at a common point at the top.',
    pills: ['photography', 'Egypt', 'Desert', 'pyramid'],
  },
  {
    title: 'Igloo',
    img: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/733655068.jpg?k=9ce97563b8ff204f4869534d6ea2da43b77d02e68d92790842a4e46e2105dd73&o=',
    desc: 'An igloo is a dome-shaped temporary shelter built from blocks of hard-packed snow',
    pills: ['photography', 'winter', 'igloo'],
  },
]

export default function Main() {
  return (
    <main>
      <Carousel
        speed={1}
        cards={Object.entries(cars).map(([slug, car]) => (
          <VehicleCard key={slug} slug={slug} car={car} />
        ))}
      />

      <div className="flex gap-x-12 my-12 flex-wrap gap-y-6" id="card-container whitespace-pre-line">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} image={card.img} description={card.desc} pills={card.pills} />
        ))}
      </div>
      <Reviews autoScroll={true} autoScrollInterval={500} />
    </main>
  )
}
