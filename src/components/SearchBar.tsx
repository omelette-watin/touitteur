import api from "@/api/api"
import useOnClickOutside from "@/hooks/useOnClickOutside"
import { UserType } from "@/types/user"
import { ArrowRightIcon, UserIcon, XIcon } from "@heroicons/react/outline"
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
  const barRef = useRef<HTMLFormElement>(null)
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
    if (debouncedSearch) {
      setLoading(true)
      getSearchResult(debouncedSearch).then((data) => {
        setSearchResults(data)
        setTimeout(() => setLoading(false), 500)
      })
    } else {
      setSearchResults([])
    }
  }, [debouncedSearch])

  useOnClickOutside(barRef, () => defocus())

  return (
    <form
      ref={barRef}
      onSubmit={handleSubmit}
      className={classNames(
        "relative flex w-full items-center rounded-full border px-5 py-1 pr-3 shadow-md transition-colors ease-in-out sm:pr-5",
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
      {focused && (
        <div className="absolute left-1/2 top-14 max-h-[50vh] min-h-[120px] w-[90vw] -translate-x-1/2 transform overflow-y-auto rounded-md bg-black text-slate-500 shadow shadow-slate-200/50 sm:w-full">
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
    </form>
  )
}

export default SearchBar
