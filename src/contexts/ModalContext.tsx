import { ModalContextType } from "@/types/modal"
import { createContext, ReactNode, useState } from "react"

export const ModalContext = createContext<ModalContextType | null>(null)

export const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState("")

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      {children}
    </ModalContext.Provider>
  )
}
