export default function Tag({content = "New", classNames = ""}){return(
  <div className = {`px-2 font-mono text-centered text-white rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 pr-2 ${classNames}`} >
    {content}
  </div>
)}
