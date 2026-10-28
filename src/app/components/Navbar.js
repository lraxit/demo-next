import Button from './Button.js'
import Tag from './Tag.js'

const nagivationButtons = [
  {
    title: 'About',
    href: '/about',
    isNew: true
  },
  {
    title: 'Home',
    href: '/',
    isNew: false
  },
]

export default function Navbar() {
  return (
    <nav className="flex justify-between bg-indigo-50 p-6 items-center sticky top-0 shadow-lg z-100">
      <div className="logo bg-indigo-600 rounded-full p-6 hover:scale-105 transition-all cursor-pointer"></div>
      <div className="flex gap-x-4 items-center">
        {nagivationButtons.map(({href, title, isNew}, index) =>
          <Button key={index} href={href} classNameProp='flex gap-2'>
            {isNew && <Tag classNames = "font-bold animate-bounce"/>}
            {title}
          </Button>
        )}
      </div>
    </nav>
  )
}
