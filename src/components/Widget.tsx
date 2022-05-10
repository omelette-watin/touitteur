import { ReactChild } from "react"

const Widget = ({ children }: { children: ReactChild }) => {
  return (
    <div className="rounded-lg bg-neutral-900/80 shadow-md">{children}</div>
  )
}

export default Widget
