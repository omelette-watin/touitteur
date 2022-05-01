import { TweetType } from "@/types/tweet"
import Image from "next/image"
import Link from "next/link"
import { DateTwitterStyle } from "./ui/Date"
import HighlightedTweet from "./ui/HighlightedTweet"

const MinimalTweet = ({ tweet }: { tweet: TweetType }) => {
  const { author, plainText } = tweet

  return (
    <div className="flex p-3 sm:text-base xl:text-lg">
      <div className="flex w-full items-start">
        <div className="flex-shrink-0">
          <Image
            src={tweet.author.urlAvatar || "/avatars/default.svg"}
            alt="Your avatar"
            className="rounded-full"
            width={48}
            height={48}
          />
        </div>
        <div className="flex max-w-[80%] flex-grow flex-col pl-3 sm:max-w-[90%]">
          <div className="space-x-2">
            <span>
              <Link href={`/${author.username}`}>
                <a className="font-extrabold text-slate-200 underline-offset-2 hover:underline">
                  {author.profileName || author.username}
                </a>
              </Link>
            </span>
            <span>
              <Link href={`/${author.username}`}>
                <a>@{author.username}</a>
              </Link>{" "}
              · <DateTwitterStyle date={tweet.createdAt as Date} />
            </span>
          </div>
          <div className="whitespace-pre-wrap break-words text-slate-200">
            {HighlightedTweet(plainText)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MinimalTweet
