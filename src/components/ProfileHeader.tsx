import Image from "next/image"
import { CalendarIcon } from "@heroicons/react/solid"
import { DateClassic } from "./ui/Date"
import useAuth from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import api from "@/api/api"
import classNames from "classnames"
import { UserType } from "@/types/user"
import useModal from "@/hooks/useModal"
import HighlightedTweet from "./ui/HighlightedTweet"

const ProfileHeader = ({ user }: { user: UserType }) => {
  const { username, profileName, urlAvatar, bio, stats, createdAt } = user
  const { user: currentUser, setUser } = useAuth()
  const [followersCount, setFollowersCount] = useState(stats?.followers)
  const isFollowed = currentUser?.following.includes(user.id)
  const isCurrentUserProfile = currentUser?.id === user.id
  const [following, setFollowing] = useState(false)
  const [follwingText, setFollowingText] = useState("Following")
  const [imageSrc, setImageSrc] = useState("")
  const { modal, setModal } = useModal()
  const handleFollow = () => {
    setFollowing(true)
    api.post(`/users/${user.id}/follow`).then(() => {
      if (currentUser) {
        if (isFollowed) {
          setFollowersCount(followersCount - 1)
          setUser({
            ...currentUser,
            following: currentUser.following.filter(
              (follow) => follow !== user.id
            ),
          })
        } else {
          setFollowersCount(followersCount + 1)
          setUser({
            ...currentUser,
            following: currentUser.following.concat(user.id),
          })
        }
      }

      setFollowing(false)
    })
  }
  const handleEdit = () => {
    setModal("edit-profile")
  }

  useEffect(() => {
    if (isCurrentUserProfile) {
      setImageSrc(currentUser.urlAvatar)
    } else {
      setImageSrc(urlAvatar)
    }

    return () => {
      setImageSrc("")
    }
  }, [user, isCurrentUserProfile, currentUser, urlAvatar])

  return (
    <div className="flex w-full flex-col items-start space-y-8 border-b border-gray-700 py-4 px-5">
      <div className="flex w-full flex-col space-y-4 sm:flex-row sm:space-x-10">
        <div className="flex-shrink-0 ">
          {imageSrc && (
            <Image
              src={imageSrc}
              width={150}
              height={150}
              className="rounded-full"
              alt={`avatar de @${username}`}
            />
          )}
        </div>

        <div className="flex w-full flex-wrap items-center justify-between space-y-2 sm:w-[70%] sm:flex-col sm:items-start sm:pb-6">
          <div className="max-w-full">
            <p className="truncate text-lg font-bold text-slate-200 sm:text-2xl">
              {isCurrentUserProfile ? currentUser?.profileName : profileName}
            </p>
            <p className="truncate text-xs sm:text-base">@{username}</p>
          </div>
          {isCurrentUserProfile ? (
            <button
              className="rounded-full border border-white bg-transparent px-5 py-1 text-white transition ease-in-out hover:bg-gray-500/20"
              onClick={handleEdit}
              disabled={!!modal}
            >
              Edit Profile
            </button>
          ) : (
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
              {!isFollowed ? "Follow" : follwingText}
            </button>
          )}
        </div>
      </div>

      <p className="max-w-full whitespace-pre-wrap break-words text-white">
        {isCurrentUserProfile ? (
          <span>
            {HighlightedTweet(
              currentUser?.bio || "This user has no bio yet ..."
            )}
          </span>
        ) : (
          <span>{HighlightedTweet(bio || "This user has no bio yet ...")}</span>
        )}
      </p>

      <div className="flew flex flex-wrap items-center">
        <div className="mr-6">
          <span className="font-bold text-white">{stats?.following}</span>{" "}
          Following
        </div>
        <div className="mr-6">
          <span className="font-bold text-white">{followersCount}</span>{" "}
          Followers
        </div>
        <div className="mr-6">
          <span className="font-bold text-white">{stats?.tweets}</span> Tweets
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="mb-1 h-5" />{" "}
          <span>
            Joined <DateClassic date={createdAt as string} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
