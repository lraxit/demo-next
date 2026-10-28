import Pill from './Pill.js'

export default function Card({ image, title, description, pills }) {
  console.log(image, title, description)
  return (
    <div className="flex-grow w-96 bg-stone-50 flex flex-col rounded-lg hover:scale-105 transition-all shadow-lg z-0">
      <img className="rounded-t-lg" src={image} alt={title} />
      <div className="flex flex-col gap-y-4 px-8 py-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p>{description}</p>
        <div className="flex gap-4 flex-wrap">
          {pills.map((pill, index) => (
            <Pill key={index} pill={pill} />
          ))}
        </div>
      </div>
    </div>
  )
}
