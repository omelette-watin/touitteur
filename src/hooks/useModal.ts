import { ModalContext } from "@/contexts/ModalContext"
import useContextAndErrorIfNull from "./useContextAndErrorIfNull"

const useModal = () => useContextAndErrorIfNull(ModalContext)

export default useModal
