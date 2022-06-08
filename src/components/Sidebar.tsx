import Image from "next/image"
import Link from "next/link"
import SidebarLink from "./SidebarLink"
import { HomeIcon, LogoutIcon } from "@heroicons/react/solid"
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
} from "@heroicons/react/outline"
import Button from "./ui/Button"
import useModal from "@/hooks/useModal"
import useAuth from "@/hooks/useAuth"
import Tooltip from "./ui/Tooltip"

const Sidebar = (): JSX.Element => {
  const { user } = useAuth()
  const { setModal } = useModal()
  const handleOpenTweetModal = () => {
    setModal("tweet")
  }
  const isActive = (pathname: string) => pathname === window.location.pathname

  return (
    <div className="fixed hidden h-full flex-col items-center overflow-y-scroll p-2 scrollbar-hide sm:flex xl:w-[340px] xl:items-start">
      <Link href={"/"}>
        <a className="hoverAnimation flex h-14 w-14 items-center justify-center p-0 xl:ml-24">
          <Image
            src="/twouitteur-white.svg"
            alt="Touitteur logo"
            width={30}
            height={30}
          />
        </a>
      </Link>
      <div className="mt-4 mb-2.5 space-y-2 xl:ml-24">
        <SidebarLink Icon={HomeIcon} active={isActive("/")}>
          Home
        </SidebarLink>
        <SidebarLink
          Icon={HashtagIcon}
          link="/explore"
          active={isActive("/explore")}
        >
          Explore
        </SidebarLink>
        <SidebarLink Icon={BellIcon}>Notifications</SidebarLink>
        <SidebarLink Icon={InboxIcon}>Messages</SidebarLink>
        <SidebarLink Icon={BookmarkIcon}>Bookmarks</SidebarLink>
        <SidebarLink Icon={ClipboardListIcon}>Lists</SidebarLink>
        <SidebarLink
          Icon={UserIcon}
          link={`/${user?.username}`}
          active={isActive(`/${user?.username}`)}
        >
          Profile
        </SidebarLink>
        <SidebarLink Icon={DotsCircleHorizontalIcon}>More</SidebarLink>
      </div>
      <Button
        className="ml-auto hidden h-[52px] w-56 py-2 xl:inline"
        onClick={handleOpenTweetModal}
      >
        Tweet
      </Button>
      <Button
        className="flex items-center justify-center p-3 xl:hidden"
        onClick={handleOpenTweetModal}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5 text-white"
          fill="white"
        >
          <g>
            <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H9c.4 0 .8-.3.8-.8s-.5-.7-1-.7zm15-4.9v-.1h-.1c-.1 0-9.2 1.2-14.4 11.7-3.8 7.6-3.6 9.9-3.3 9.9.3.1 3.4-6.5 6.7-9.2 5.2-1.1 6.6-3.6 6.6-3.6s-1.5.2-2.1.2c-.8 0-1.4-.2-1.7-.3 1.3-1.2 2.4-1.5 3.5-1.7.9-.2 1.8-.4 3-1.2 2.2-1.6 1.9-5.5 1.8-5.7z" />
          </g>
        </svg>
      </Button>
      <div className="hoverAnimation mt-auto flex items-center justify-center text-[#d9d9d9] xl:ml-24 xl:w-[244px] xl:justify-start">
        <Image
          src={user?.urlAvatar || "/avatars/default.svg"}
          alt="Your avatar"
          className="rounded-full"
          width={36}
          height={36}
        />
        <div className="hidden leading-5 xl:ml-3 xl:inline ">
          <p className="truncate font-bold xl:max-w-[130px]">
            {user?.profileName}
          </p>
          <p className="truncate text-[#6e767d] xl:max-w-[130px]">
            @{user?.username}
          </p>
        </div>
        <Link href="/logout">
          <a className="group relative ml-auto hidden xl:inline">
            <LogoutIcon className="h-5" />
            <Tooltip>Logout</Tooltip>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
