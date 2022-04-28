import useAuth from "@/hooks/useAuth"
import TweetForm from "./TweetForm"
import Image from "next/image"
import { TweetType } from "@/types/tweet"

const TweetBox = ({ replying }: { replying: TweetType | null }) => {
  const { user } = useAuth()

  return (
    <div className="flex w-full items-start p-3 scrollbar-hide">
      <div className="flex-shrink-0">
        <Image
          src={user?.urlAvatar || "/avatars/default.svg"}
          alt="Your avatar"
          className="rounded-full"
          width={48}
          height={48}
        />
      </div>
      <TweetForm replying={replying} />
    </div>
  )
}

export default TweetBox
