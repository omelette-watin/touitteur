import useAuth from "@/hooks/useAuth"
import TweetForm from "./TweetForm"
import Image from "next/image"
import { TweetType } from "@/types/tweet"
import Link from "next/link"

const TweetBox = ({
  replying,
  openFull = false,
}: {
  replying: TweetType | null
  openFull?: boolean
}) => {
  const { user } = useAuth()

  return (
    <div className="flex w-full items-start p-3 scrollbar-hide">
      <div className="flex-shrink-0">
        <Link href={`/${user?.username}`}>
          <a>
            <Image
              src={user?.urlAvatar || "/avatars/default.svg"}
              alt="Your avatar"
              className="rounded-full"
              width={48}
              height={48}
            />
          </a>
        </Link>
      </div>
      <TweetForm replying={replying} openFull={openFull} />
    </div>
  )
}

export default TweetBox
