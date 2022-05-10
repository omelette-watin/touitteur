import api from "@/api/api"
import useAuth from "@/hooks/useAuth"
import useModal from "@/hooks/useModal"
import useReplyTo from "@/hooks/useReplyTo"
import { TweetType } from "@/types/tweet"
import { useEffect, useState } from "react"
import Tooltip from "./ui/Tooltip"
import { CheckIcon, HeartIcon, ShareIcon } from "@heroicons/react/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid"
import Image from "next/image"
import Link from "next/link"
import stopPropagation from "@/utils/stopPropagation"
import { UserType } from "@/types/user"
import HighlightedTweet from "./ui/HighlightedTweet"
import { DateClassic } from "./ui/Date"
import classNames from "classnames"
import TweetBox from "./TweetBox"
import { AiOutlineRetweet } from "react-icons/ai"
import { FaRegComment } from "react-icons/fa"

const MainTweet = ({ tweet }: { tweet: TweetType }) => {
  const { user, setUser } = useAuth()
  const { setModal } = useModal()
  const { setReplyingTo } = useReplyTo()
  const author: UserType = tweet.author
  const originalTweet = tweet.originalTweet
  const [replyClicked, setReplyClicked] = useState(false)
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

  useEffect(() => {
    return () => setReplyClicked(false)
  }, [tweet])

  return (
    <div className="flex w-full flex-col border-b border-gray-700 pb-2 text-sm transition ease-in-out sm:text-base xl:text-lg">
      <div className="flex w-full flex-col items-start space-y-4 p-3">
        <div className="mt-1 flex flex-shrink-0 space-x-4">
          <Link href={`/${author.username}`}>
            <a>
              <Image
                width={48}
                height={48}
                alt={`${author.username} avatar`}
                src={author?.urlAvatar || "/avatars/default.svg"}
                className="rounded-full bg-gray-300"
              />
            </a>
          </Link>
          <div className="flex flex-col space-y-0">
            <span className="font-extrabold">
              <Link href={`/${author.username}`}>
                <a
                  onClick={(e) => {
                    stopPropagation(e)
                  }}
                  className="text-slate-200 underline-offset-2 hover:underline"
                >
                  {author.profileName || author.username}
                </a>
              </Link>
            </span>
            <span>
              <Link href={`/${author.username}`}>
                <a>@{author.username}</a>
              </Link>{" "}
            </span>
          </div>
        </div>
        {originalTweet && (
          <div className="z-10 mt-2">
            <p>
              Replying to{" "}
              <Link href={`/${originalTweet.author.username}`}>
                <a
                  onClick={(e) => {
                    stopPropagation(e)
                  }}
                  className="text-twitter underline-offset-1 hover:underline"
                >
                  @{originalTweet.author.username}
                </a>
              </Link>
            </p>
          </div>
        )}
        <div className="whitespace-pre-wrap break-words text-xl text-slate-200 sm:text-2xl">
          {HighlightedTweet(tweet.plainText)}
        </div>
        <div className="w-full border-b border-gray-700 pb-4">
          <DateClassic date={tweet.createdAt as string} />
        </div>
        <div className="flex w-full flex-wrap space-x-3 border-b border-gray-700 pb-4">
          <div>
            <span className="text-white">{likesCount}</span> Like
            {likesCount > 0 && "s"}
          </div>
          <div>
            <span className="text-white">{retweetsCount}</span> Retweet
            {retweetsCount > 0 && "s"}
          </div>
          <div>
            <span className="text-white">{tweet._count.replies}</span> Repl
            {tweet._count.replies > 0 ? "ies" : "y"}
          </div>
        </div>
        <div className="mt-2 flex w-full items-center justify-around border-b border-gray-700 pb-4 text-[#71767b]">
          <div
            className="hover:text-twitter group relative flex cursor-pointer items-center space-x-1 transition ease-in-out"
            onClick={handleReply}
          >
            <FaRegComment
              size={36}
              className="group-hover:bg-twitter/10 h-8 rounded-full p-2 transition ease-in-out lg:h-10"
            />
            <Tooltip>Reply</Tooltip>
          </div>
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
                size={38}
                className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-green-500/10 lg:h-10"
              />
            ) : (
              <AiOutlineRetweet
                size={38}
                className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-green-500/10 lg:h-10"
              />
            )}
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
              <HeartIconSolid className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-red-500/10 lg:h-10" />
            ) : (
              <HeartIcon className="h-8 rounded-full p-2 transition ease-in-out group-hover:bg-red-500/10 lg:h-10" />
            )}
            <Tooltip>Like</Tooltip>
          </button>
          <button
            className="hover:text-twitter group relative flex cursor-pointer items-center space-x-1 transition ease-in-out"
            onClick={handleCopyLink}
          >
            {copied ? (
              <CheckIcon className="bg-twitter/10 text-twitter h-8 rounded-full p-2 transition ease-in-out lg:h-10" />
            ) : (
              <ShareIcon className="group-hover:bg-twitter/10 h-8 rounded-full p-2 transition ease-in-out lg:h-10" />
            )}
            <Tooltip>Copy link</Tooltip>
          </button>
        </div>
      </div>
      {replyClicked ? (
        <TweetBox replying={tweet} openFull={true} />
      ) : (
        <div className="flex w-full items-center justify-between p-3 pr-6 scrollbar-hide">
          <div className="flex flex-shrink-0 items-center space-x-3">
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
            <p className="cursor-text" onClick={() => setReplyClicked(true)}>
              Tweet your reply
            </p>
          </div>
          <button
            className="disabled:bg-twitter/50 flex items-center rounded-full border-0 py-1 px-4 text-base font-semibold text-slate-200/50 disabled:cursor-default sm:text-lg"
            disabled
            type="submit"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  )
}

export default MainTweet
