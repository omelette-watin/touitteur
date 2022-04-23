import { ReactChild } from "react"

const GalaxyBackground = ({
  children,
}: {
  children: ReactChild
}): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/galaxy.jpg')] bg-cover">
      {children}
    </div>
  )
}

export default GalaxyBackground
