import useOnClickOutside from "@/hooks/useOnClickOutside"
import useModal from "@/hooks/useModal"
import classNames from "classnames"
import { useRef } from "react"
import { XIcon } from "@heroicons/react/outline"
import TweetBox from "./TweetBox"
import useReplyTo from "@/hooks/useReplyTo"
import MinimalTweet from "./MinimalTweet"
import Link from "next/link"
import ProfileForm from "./ProfileForm"

const Modal = (): JSX.Element => {
  const { modal, setModal } = useModal()
  const { replyingTo } = useReplyTo()
  const modalContentRef = useRef<HTMLDivElement>(null)
  const handleCloseModal = () => {
    if (modal) {
      setModal("")
    }
  }
  useOnClickOutside(modalContentRef, handleCloseModal)

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
        className="z-10 flex w-full max-w-[100vw] flex-col rounded-xl border-white bg-black py-1 shadow-neutral-800 sm:w-[600px] sm:border-[1px] sm:p-4 sm:shadow-lg xl:w-[700px]"
        ref={modalContentRef}
      >
        <button
          onClick={handleCloseModal}
          className="self-start rounded-full p-2 hover:bg-[#d9d9d9] hover:bg-opacity-10"
        >
          <XIcon color="white" height={20} width={20} />
        </button>
        {modal === "edit-profile" && <ProfileForm />}
        {modal === "tweet" && <TweetBox replying={null} />}
        {modal === "reply" && replyingTo && (
          <>
            <MinimalTweet tweet={replyingTo} />
            <p className="ml-[48px] pl-6 text-sm text-slate-500">
              Replying to{" "}
              <Link href={`/user/${replyingTo.author.username}`}>
                <a className="text-twitter underline-offset-1 hover:underline">
                  @{replyingTo.author.username}
                </a>
              </Link>
            </p>
            <TweetBox replying={replyingTo} />
          </>
        )}
      </div>
    </div>
  )
}

export default Modal
