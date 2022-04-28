import { ReactChild } from "react"
import Modal from "./Modal"
import Head from "next/head"
import Sidebar from "./Sidebar"

interface LayoutProps {
  children: ReactChild
  title: string
}

const Layout = ({ children, title }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>{`${title} / `}Touitteur</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-[1500px]">
        <Sidebar />
        {children}
      </main>
      <Modal />
    </>
  )
}

export default Layout
