import Button from './Button.js'
import Tag from './Tag.js'
import { Battery50Icon } from '@heroicons/react/24/solid'

const nagivationButtons = [
  {
    title: 'About',
    href: '/about',
    isNew: true,
  },
  {
    title: 'Home',
    href: '/',
    isNew: false,
  },
]

export default function Navbar() {
  return (
    <nav className="flex justify-between bg-indigo-50 p-4 items-center sticky top-0 shadow-lg z-100">
      <a href="/" className="logo bg-stone-100 rounded-full pl-2 hover:scale-105 hover:bg-stone-200 transition-all cursor-pointer">
        <Battery50Icon className="w-8 text-yellow-500" />
        {/* <img className="w-50 h-auto rounded-full" src="/images/logo.png"/> */}
      </a>
      <div className="flex gap-x-4 items-center">
        {nagivationButtons.map(({ href, title, isNew }, index) => (
          <Button key={index} href={href} classNameProp="flex gap-2">
            {isNew && <Tag classNames="font-bold animate-bounce" />}
            {title}
          </Button>
        ))}
      </div>
    </nav>
  )
}
