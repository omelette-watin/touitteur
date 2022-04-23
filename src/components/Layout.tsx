import { ReactChild } from "react"
import Modal from "./Modal"
import Sidebar from "./Sidebar"

interface LayoutProps {
  children: ReactChild
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-[1500px]">
        <Sidebar />
        {children}
      </main>
      <Modal />
    </>
  )
}

export default Layout
