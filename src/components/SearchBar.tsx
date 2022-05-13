import api from "@/api/api"
import useOnClickOutside from "@/hooks/useOnClickOutside"
import { UserType } from "@/types/user"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline"
import classNames from "classnames"
import Image from "next/image"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useDebounce } from "use-debounce"
import Loading from "./ui/Loading"

const getSearchResult = (searchTerm: string) => {
  return api.get(`/users/search/${searchTerm}`).then(({ data }) => data)
}
const SearchBar = () => {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 500)
  const [searchResults, setSearchResults] = useState<UserType[] | []>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const handleChange = (e: any) => {
    setSearch(e.target.value)
  }
  const handleOnResultClick = (path: string) => {
    setSearch("")
    setFocused(false)
    router.push(path)
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${search}`)
  }
  const defocus = () => {
    setFocused(false)
  }

  useEffect(() => {
    setLoading(true)

    if (debouncedSearch) {
      getSearchResult(debouncedSearch).then(setSearchResults)
    } else {
      setSearchResults([])
    }

    setLoading(false)
  }, [debouncedSearch])

  useOnClickOutside(barRef, () => defocus())

  return (
    <div
      ref={barRef}
      className={classNames("w-full lg:relative lg:mr-1 lg:p-0", {
        "fixed inset-0 overscroll-none bg-black py-3": focused,
      })}
    >
      <div
        className={classNames("flex w-full items-center lg:px-0", {
          "px-3": focused,
        })}
      >
        <button
          type="button"
          className={classNames("mr-3 lg:hidden", {
            hidden: !focused,
          })}
          onClick={defocus}
        >
          <ArrowLeftIcon className="h-5" />
        </button>
        <form
          onSubmit={handleSubmit}
          className={classNames(
            "flex w-full items-center rounded-full border px-5 py-1 shadow-md transition-colors ease-in-out",
            {
              "border-blue-500 text-blue-500": focused,
              "border-neutral-900/70 bg-neutral-800/70": !focused,
            }
          )}
          onFocus={() => setFocused(true)}
        >
          <FaSearch className="transition-colors ease-in-out" />
          <input
            name="q"
            type="text"
            value={search}
            onChange={handleChange}
            className="w-full border-none bg-transparent px-2 py-1 text-slate-200 outline-none sm:px-3 sm:py-2"
            placeholder="Search Touitteur"
            autoComplete="off"
          />
          {search && (
            <>
              <button
                type="submit"
                className="block rounded-full bg-blue-500 p-1 text-black sm:hidden"
              >
                <ArrowRightIcon className="h-4" />
              </button>
              <button
                type="button"
                className={classNames(
                  "hidden rounded-full bg-blue-500 p-1 text-black lg:block",
                  {
                    "lg:hidden": !focused,
                  }
                )}
                onClick={() => setSearch("")}
              >
                <XIcon className="h-4" />
              </button>
            </>
          )}
        </form>
        <button
          type="button"
          className={classNames("ml-3 lg:hidden", {
            hidden: !focused,
          })}
        >
          <SparklesIcon className="h-5" />
        </button>
      </div>
      {focused && (
        <div className="w-full rounded-md bg-black text-slate-500 shadow lg:absolute lg:left-1/2 lg:top-14 lg:max-h-[50vh] lg:min-h-[120px] lg:-translate-x-1/2 lg:transform lg:overflow-y-auto lg:shadow-slate-200/50">
          {!debouncedSearch && (
            <p className="m-4 text-center text-sm">
              Try searching for people, topics or keywords
            </p>
          )}
          {debouncedSearch && (
            <p className="m-4 text-slate-200">Search for "{debouncedSearch}"</p>
          )}
          {loading && (
            <p className="text-center">
              <Loading color="#1d9bf0" />
            </p>
          )}
          {!loading &&
            searchResults.length > 0 &&
            searchResults.map((user) => {
              return (
                <div
                  key={user.id}
                  className="flex cursor-pointer items-center px-4 py-3 transition-colors hover:bg-neutral-900/50"
                  onClick={() => handleOnResultClick(user.username)}
                >
                  <Image
                    src={user.urlAvatar || "/avatars/default.svg"}
                    height={56}
                    width={56}
                    alt={`@${user.username}'s avatar`}
                    className="rounded-full"
                  />
                  <div className="ml-4 text-sm">
                    <p className="text-base font-bold leading-[1.25rem] text-slate-200">
                      {user.profileName || user.username}
                    </p>
                    <p>@{user.username}</p>
                    <div className="flex items-center">
                      <UserIcon className="mr-1 h-4" />
                      <p>{user._count?.followers} Followers</p>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default SearchBar
