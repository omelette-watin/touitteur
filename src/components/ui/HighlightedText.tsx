import { ReactChild } from "react"

const HighlightedText = ({
  children,
}: {
  children: ReactChild
}): JSX.Element => {
  return <span className="font-semibold text-[#1B95E0]">{children}</span>
}

export default HighlightedText
