import useModal from "@/hooks/useModal"
import useReplyTo from "@/hooks/useReplyTo"
import { TweetEventType, TweetType } from "@/types/tweet"
import { UserType } from "@/types/user"
import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { DateTwitterStyle } from "./ui/Date"
import HighlightedTweet from "./ui/HighlightedTweet"
import Tooltip from "./ui/Tooltip"
import { CheckIcon, HeartIcon, ShareIcon } from "@heroicons/react/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid"
import useAuth from "@/hooks/useAuth"
import api from "@/api/api"
import { useRouter } from "next/router"
import stopPropagation from "@/utils/stopPropagation"
import { AiOutlineRetweet } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"

const Tweet = ({ element }: { element: TweetType | TweetEventType }) => {
  const router = useRouter()
  const tweet: TweetType = (element as TweetEventType).targetTweet || element
  const author: UserType = tweet.author
  const { user, setUser } = useAuth()
  const { setModal } = useModal()
  const { setReplyingTo } = useReplyTo()
  const [copied, setCopied] = useState(false)
  const [likesCount, setLikesCount] = useState(tweet._count.likes)
  const [retweetsCount, setRetweetsCount] = useState(tweet._count.retweets)
  const [liking, setLiking] = useState(false)
  const [retweeting, setRetweeting] = useState(false)
  const isLiked = user?.likes.includes(tweet.id)
  const isRetweeted = user?.retweets.includes(tweet.id)
  const handleLike = (e: any) => {
    e.stopPropagation()
    setLiking(true)
    api.post(`/tweets/${tweet.id}/like`).then(() => {
      if (user) {
        if (isLiked) {
          setLikesCount((prev) => prev - 1)
          setUser({
            ...user,
            likes: user?.likes.filter((like) => like !== tweet.id),
          })
        } else {
          setLikesCount((prev) => prev + 1)
          setUser({
            ...user,
            likes: user?.likes.concat(tweet.id),
          })
        }
      }

      setLiking(false)
    })
  }
  const handleRetweet = (e: any) => {
    e.stopPropagation()
    setRetweeting(true)
    api.post(`/tweets/${tweet.id}/retweet`).then(() => {
      if (user) {
        if (isRetweeted) {
          setRetweetsCount(retweetsCount - 1)
          setUser({
            ...user,
            retweets: user?.retweets.filter((retweet) => retweet !== tweet.id),
          })
        } else {
          setRetweetsCount(retweetsCount + 1)
          setUser({
            ...user,
            retweets: user?.retweets.concat(tweet.id),
          })
        }
      }

      setRetweeting(false)
    })
  }
  const handleReply = (e: any) => {
    e.stopPropagation()
    setReplyingTo(tweet)
    setModal("reply")
  }
  const handleCopyLink = (e: any) => {
    e.stopPropagation()
    navigator.clipboard.writeText(
      `https://touitteur.vercel.app/status/${tweet.id}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }
  const handleClickOnTweet = () => {
    if (!window.getSelection()?.toString()) {
      router.push(`/status/${tweet.id}`)
    }
  }

  return (
    <div
      className="flex cursor-pointer flex-col border-b border-gray-700 p-3 transition-colors ease-in-out hover:bg-neutral-900/50 sm:text-base xl:text-lg"
      onClick={handleClickOnTweet}
    >
      {element.type && element.type !== "tweet" && (
        <div className="text-xs sm:mb-2 sm:text-sm">
          <p className="inline-flex items-center">
            {element.type === "reply" && (
              <>
                <FaRegComment size={34} className="h-8 p-2" />
                Replying to
                <Link href={`/${tweet.originalTweet?.author.username}`}>
                  <a
                    onClick={(e) => {
                      stopPropagation(e)
                    }}
                    className="text-twitter ml-1 underline-offset-1 hover:underline"
                  >
                    @{tweet.originalTweet?.author.username}
                  </a>
                </Link>
              </>
            )}
            {element.type === "like" && (
              <>
                <HeartIconSolid className="h-8 p-2" />
                <Link href={`/${element.author.username}`}>
                  <a
                    onClick={(e) => {
                      stopPropagation(e)
                    }}
                    className="text-twitter mr-1 underline-offset-1 hover:underline"
                  >
                    @{element.author.username}
                  </a>
                </Link>
                liked this
              </>
            )}
            {element.type === "retweet" && (
              <>
                <AiOutlineRetweet className="h-8 p-2" size={32} />
                <Link href={`/${element.author.username}`}>
                  <a
                    onClick={(e) => {
                      stopPropagation(e)
                    }}
                    className="text-twitter mr-1 underline-offset-1 hover:underline"
                  >
                    @{element.author.username}
                  </a>
                </Link>{" "}
                retweeted this
              </>
            )}
          </p>
        </div>
      )}
      {!element.type && tweet.originalTweet && (
        <div className="text-xs sm:mb-2 sm:text-sm">
          <p className="inline-flex items-center">
            <FaRegComment size={32} className="h-8 p-2" />
            Replying to
            <Link href={`/${tweet.originalTweet.author.username}`}>
              <a
                onClick={(e) => {
                  stopPropagation(e)
                }}
                className="text-twitter ml-1 underline-offset-1 hover:underline"
              >
                @{tweet.originalTweet.author.username}
              </a>
            </Link>
          </p>
        </div>
      )}
      <div className="flex w-full items-start">
        <div className="flex-shrink-0">
          <Link href={`/${author.username}`}>
            <a onClick={(e) => stopPropagation(e)}>
              <Image
                src={tweet.author.urlAvatar || "/avatars/default.svg"}
                alt="Your avatar"
                className="rounded-full"
                width={48}
                height={48}
              />
            </a>
          </Link>
        </div>
        <div className="flex max-w-[80%] flex-grow flex-col pl-3 sm:max-w-[90%]">
          <div className="space-x-2">
            <span>
              <Link href={`/${author.username}`}>
                <a
                  className="font-extrabold text-slate-200 underline-offset-2 hover:underline"
                  onClick={(e) => stopPropagation(e)}
                >
                  {author.profileName || author.username}
                </a>
              </Link>
            </span>
            <span>
              <Link href={`/${author.username}`}>
                <a onClick={(e) => stopPropagation(e)}>@{author.username}</a>
              </Link>{" "}
              ·{" "}
              <span className="cursor-text">
                <DateTwitterStyle date={tweet.createdAt as Date} />
              </span>
            </span>
          </div>
          <div className="whitespace-pre-wrap break-words text-slate-200">
            {HighlightedTweet(tweet.plainText)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs sm:pr-8 lg:text-sm">
            <button
              className="hover:text-twitter group relative flex cursor-pointer items-center space-x-1 transition ease-in-out"
              onClick={handleReply}
            >
              <FaRegComment
                size={32}
                className="group-hover:bg-twitter/10 h-8 rounded-full p-2 transition ease-in-out lg:h-9"
              />
              <span>{tweet._count.replies}</span>
              <Tooltip>Reply</Tooltip>
            </button>
            <button
              className={classNames(
                "group relative flex cursor-pointer items-center space-x-1 transition ease-in-out hover:text-green-500",
                {
                  "text-green-500": isRetweeted,
                }
              )}
              onClick={handleRetweet}
              disabled={retweeting}
            >
              {isRetweeted ? (
                <AiOutlineRetweet
                  size={36}
                  className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-green-500/10 lg:h-9"
                />
              ) : (
                <AiOutlineRetweet
                  size={36}
                  className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-green-500/10 lg:h-9"
                />
              )}
              <span>{retweetsCount}</span>
              <Tooltip>Retweet</Tooltip>
            </button>
            <button
              className={classNames(
                "group relative flex cursor-pointer items-center space-x-1 transition ease-in-out hover:text-red-500",
                {
                  "text-red-500": isLiked,
                }
              )}
              onClick={handleLike}
              disabled={liking}
            >
              {isLiked ? (
                <HeartIconSolid className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-red-500/10 lg:h-9" />
              ) : (
                <HeartIcon className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-red-500/10 lg:h-9" />
              )}
              <span>{likesCount}</span>
              <Tooltip>Like</Tooltip>
            </button>
            <button
              className="hover:text-twitter group relative flex cursor-pointer items-center space-x-1 transition ease-in-out"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <CheckIcon className="bg-twitter/10 text-twitter h-8 rounded-full p-2 transition ease-in-out lg:h-9" />
                  <Tooltip>Copied !</Tooltip>
                </>
              ) : (
                <>
                  <ShareIcon className="group-hover:bg-twitter/10 h-8 rounded-full p-2 transition ease-in-out lg:h-9" />
                  <Tooltip>Copy link</Tooltip>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tweet
