import { ReactNode } from "react"

const GalaxyBackground = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/galaxy.jpg')] bg-cover">
      {children}
    </div>
  )
}

export default GalaxyBackground
