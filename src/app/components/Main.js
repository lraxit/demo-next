import Card from './Card'
import Content from './Content'
import Flex from './Flex'

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
      <div className="flex gap-x-12 my-12 flex-wrap gap-y-6" id="card-container whitespace-pre-line">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} image={card.img} description={card.desc} pills={card.pills} />
        ))}
      </div>
      <div className="flex flex-auto gap-4">
        <Content
          text={`I like to creep around my home and act like a goblin I don’t know why but I just enjoy doing this. Maybe it’s my way of dealing with stress or something but I just do it about once every week. Generally I’ll carry around a sack and creep around in a sort of crouch-walking position making goblin noises, then I’ll walk around my house and pick up various different “trinkets” and put them in my bag while saying stuff like “I’ll be having that” and laughing maniacally in my goblin voice (“trinkets” can include anything from shit I find on the ground to cutlery or other utensils). The other day I was talking with my neighbours and they mentioned hearing weird noises like what I wrote about and I was just internally screaming the entire conversation. I’m 99% sure they don’t know it’s me but god that 1% chance is seriously weighing on my mind.`}
        />
        <Content
          text={`So do you guys know those waterslides that you stand in, and then they suddenly drop you straight down onto the water slide? If not, look them up on YouTube, there's nothing like them. Ah yes, the sweet memories of my first time on one of these. I feel that my mental/emotional scars have healed enough to tell this gem. At the time my girlfriend, now Fiancée, worked as a photographer for one of those resorts with the indoor and outdoor water parks. One of her perks was that her and a family member/friend could get into the waterpark for free, so one hot summer day she had off and we both decided it'd be fun to go there and cool down for the day. While we were there, I discovered one of there most "Thrilling" looking waterslides. Basically you stand in this tube, and then the slide operator presses a button and this slide drops you straight down a good 90 FEET, before you actually start going down the water slide. Me, being a thrill seeker, of course had to try it. So I made the great climb up to the top of the slide, stood in line, and finally it was my turn. Once I got in the tube, the operator told me to keep my legs crossed. Now I'm a pretty big heavy guy, so I was like "That's uncomfortable as fuck, I'm not doing that". So there I was standing in the tube, having a panic attack from anticipation, with my legs not crossed. The operator finally presses the button, the bottom opens and I fall straight down the water slide. Very quickly I realized why they have you cross your legs. Water shot so far up my ass, so fast, I swear I tasted it in my mouth. My body raced down that slide, as I questioned every life choice that I have ever made. Once I made it to the bottom, I sat there for a moment, absolutely violated. I felt like someone in an episode of Law & Order: Special Victims Unit. I built up the courage to finally stand up, and all I could feel was the nice warm stream of water mixed with shit, and maybe a little bit of blood shoot out of my ass faster than the Steamboat Geyser at Yellowstone National Park. I quickly got off the slide and ran to the bathroom, with a trail of shitty water tailing me as the slide operator stared in awe. They had to shut down the slide for the rest of the day :'), but man was my asshole clean after that! Moral of the story: Keep your damn legs crossed on waterslides.`}
        />
      </div>

      <Flex classNames="bg-blue-600 text-blue-100">
        <span>Child tag one</span>
        <span>Child tag two</span>
        <span>Child tag three</span>
      </Flex>
    </main>
  )
}
