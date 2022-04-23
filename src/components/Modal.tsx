import useClickOutside from "@/hooks/useClickOutside"
import useModal from "@/hooks/useModal"
import classNames from "classnames"
import Button from "./ui/Button"

const Modal = (): JSX.Element => {
  const { modal, setModal } = useModal()
  const handleCloseModal = () => {
    if (modal) {
      setModal("")
    }
  }
  const nodeDom = useClickOutside(() => {
    handleCloseModal()
  })

  return (
    <div
      className={classNames(
        "fixed inset-0 z-50 flex w-screen items-start justify-center overflow-y-scroll overscroll-contain bg-black pb-16 sm:bg-black/70 sm:pt-24",
        {
          hidden: !modal,
        }
      )}
    >
      <div
        className="rounded-lg bg-slate-200 p-3 text-center text-black"
        ref={nodeDom}
      >
        <h1 className="text-xl">Modal Content Place Holder</h1>
        <p>Click out side to close whole Modal</p>
        <br />
        <p>or</p>
        <Button className="px-6" onClick={handleCloseModal}>
          Click here
        </Button>
      </div>
    </div>
  )
}

export default Modal