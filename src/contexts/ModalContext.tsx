import { ModalContextType } from "@/types/modal"
import { createContext, ReactChild, useState } from "react"

export const ModalContext = createContext<ModalContextType | null>(null)

export const ModalContextProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [modal, setModal] = useState<string>("")

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
      {children}
    </ModalContext.Provider>
  )
}
