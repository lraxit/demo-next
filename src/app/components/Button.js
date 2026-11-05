export default function Button({ href = null, children, classNameProp = '' }) {
  const classNames = `px-6 py-4 bg-indigo-100 hover:bg-indigo-200 active:bg-indigo-300 shadow-md transition-all cursor-pointer border-0 rounded-md ${classNameProp}`
  return href ? (
    <a href={href} className={classNames}>
      {children}
    </a>
  ) : (
    <button className={classNames}>{children}</button>
  )
}
