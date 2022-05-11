import api from "@/api/api"
import useAuth from "@/hooks/useAuth"
import { UserType } from "@/types/user"
import stopPropagation from "@/utils/stopPropagation"
import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "./ui/Loading"

const Suggestion = ({ user }: { user: UserType }) => {
  const { user: currentUser, setUser } = useAuth()
  const router = useRouter()
  const handleClickOnUser = () => {
    router.push(`/${user.username}`)
  }
  const isFollowed = currentUser?.following.includes(user.id)
  const [following, setFollowing] = useState(false)
  const [followingText, setFollowingText] = useState("Following")
  const handleFollow = (e: any) => {
    e.stopPropagation()
    setFollowing(true)
    api.post(`/users/${user.id}/follow`).then(() => {
      if (currentUser) {
        if (isFollowed) {
          setUser({
            ...currentUser,
            following: currentUser.following.filter(
              (follow) => follow !== user.id
            ),
          })
        } else {
          setUser({
            ...currentUser,
            following: currentUser.following.concat(user.id),
          })
        }
      }

      setFollowing(false)
    })
  }

  return (
    <div
      onClick={handleClickOnUser}
      className="flex cursor-pointer items-center justify-between px-4 py-2 transition-colors ease-in-out hover:bg-neutral-800"
    >
      <div className="flex items-center space-x-2">
        <Link href={`/${user.username}`}>
          <a onClick={(e) => stopPropagation(e)}>
            <Image
              src={user.urlAvatar || "/avatars/default.svg"}
              alt="Your avatar"
              className="rounded-full"
              width={48}
              height={48}
            />
          </a>
        </Link>
        <div>
          <Link href={`/${user.username}`} key={user.id}>
            <a
              className="font-bold text-slate-200 underline-offset-2 hover:underline"
              onClick={(e) => stopPropagation(e)}
            >
              {user.profileName || user.username}
            </a>
          </Link>
          <p className="text-sm">@{user.username}</p>
        </div>
      </div>
      <div>
        <button
          className={classNames(
            "bg-twitter rounded-full px-5 py-1 text-white transition ease-in-out hover:bg-[#1a8cd8]",
            {
              "border border-white bg-transparent hover:border-red-600 hover:bg-transparent hover:text-red-600":
                isFollowed,
              "animate-pulse": following,
            }
          )}
          onClick={handleFollow}
          onMouseEnter={() => setFollowingText("Unfollow")}
          onMouseLeave={() => setFollowingText("Following")}
          disabled={following}
        >
          {!isFollowed ? "Follow" : followingText}
        </button>
      </div>
    </div>
  )
}
const FollowSuggestions = ({ take = 3 }: { take?: number }) => {
  const router = useRouter()
  const [followSuggestions, setFollowSuggestions] = useState([])
  const [loadingFollowSuggestions, setLoadingFollowSuggestions] = useState(true)

  useEffect(() => {
    api.get(`/users/suggestions?take=${take}`).then(({ data }) => {
      setFollowSuggestions(data)
      setLoadingFollowSuggestions(false)
    })
  }, [router, take])

  return (
    <div className="flex flex-col py-3">
      <h1 className="mb-2 px-4 text-xl font-extrabold text-slate-200">
        Who to follow
      </h1>
      <div className="flex min-h-[200px] flex-col justify-center">
        <div className="text-center">
          {loadingFollowSuggestions && <Loading color="#1d9bf0" />}
        </div>
        {followSuggestions.length > 0 &&
          followSuggestions.map((user: UserType) => {
            return <Suggestion user={user} key={user.id} />
          })}
      </div>
    </div>
  )
}

export default FollowSuggestions
