import { ReactChild } from "react"

const Tooltip = ({ children }: { children: ReactChild }) => {
  return (
    <div className="absolute -bottom-7 -right-7 hidden w-fit rounded bg-gray-700/80 py-1 px-2 text-xs text-white shadow-sm group-hover:block">
      {children}
    </div>
  )
}

export default Tooltip
