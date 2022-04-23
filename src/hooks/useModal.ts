import { ModalContext } from "@/contexts/ModalContext"
import { useContext } from "react"

const useModal = () => useContext(ModalContext)

export default useModal
