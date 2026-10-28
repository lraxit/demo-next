export default function Flex({ children, classNames }) {
  return <div className={`flex items-center ${classNames}`}>{children}</div>
}
