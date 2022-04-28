import useAuth from "@/hooks/useAuth"
import TweetForm from "./TweetForm"
import Image from "next/image"

const WhatsHappeningBox = () => {
  const { user } = useAuth()

  return (
    <div className="flex w-full items-start border-b border-gray-700 p-3 scrollbar-hide">
      <div className="flex-shrink-0">
        <Image
          src={user?.urlAvatar || "/avatars/default.svg"}
          alt="Your avatar"
          className="rounded-full"
          width={48}
          height={48}
        />
      </div>
      <TweetForm replying={null} />
    </div>
  )
}

export default WhatsHappeningBox
