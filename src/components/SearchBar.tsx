import api from "@/api/api"
import useOnClickOutside from "@/hooks/useOnClickOutside"
import { UserType } from "@/types/user"
import classNames from "classnames"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useDebounce } from "use-debounce"

const getSearchResult = (searchTerm: string) => {
  return api.get(`/users/search/${searchTerm}`).then(({ data }) => data)
}
const SearchBar = () => {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 500)
  const [searchResults, setSearchResults] = useState<UserType[] | []>([])
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

  useEffect(() => {
    if (debouncedSearch) {
      getSearchResult(debouncedSearch).then(setSearchResults)
    } else {
      setSearchResults([])
    }
  }, [debouncedSearch])

  useOnClickOutside(barRef, () => setFocused(false))

  return (
    <div
      ref={barRef}
      className={classNames(
        "relative mr-1 flex items-center rounded-full border px-5 py-1 shadow-md transition-colors ease-in-out",
        {
          "border-blue-500 text-blue-500": focused,
          "border-neutral-900/70 bg-neutral-800/70": !focused,
        }
      )}
      onFocus={() => setFocused(true)}
    >
      <FaSearch className="transition-colors ease-in-out" />
      <input
        type="text"
        value={search}
        onChange={handleChange}
        className="w-full border-none bg-transparent px-3 py-2 text-slate-200 outline-none"
        placeholder="Search Touitteur"
      />
      {focused && (
        <div className="absolute top-14 left-1/2 min-h-[120px] w-full -translate-x-1/2 transform rounded-md bg-black text-slate-500 shadow shadow-slate-200/50">
          {search === "" && (
            <p className="m-4 text-center text-sm">
              Try searching for people, topics or keywords
            </p>
          )}
          {debouncedSearch && (
            <p className="m-4 text-slate-200">Search for "{debouncedSearch}"</p>
          )}
          {debouncedSearch &&
            searchResults.map((user) => {
              return (
                <div
                  key={user.id}
                  className="flex cursor-pointer items-center px-4 py-3 transition-colors hover:bg-neutral-900/50"
                  onClick={() => handleOnResultClick(user.username)}
                >
                  <Image
                    src={user.urlAvatar || "/avatars/default.svg"}
                    height={48}
                    width={48}
                    alt={`@${user.username}'s avatar`}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="text-lg text-slate-200">
                      {user.profileName || user.username}
                    </p>
                    <p>@{user.username}</p>
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
