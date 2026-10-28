// inside Header.js
export default function Header({children, classNames=''}) {
  return <header className= {`flex flex-col gap-y-6 font-bold text-4xl ${classNames}`}>
    {children}
  </header>
}
