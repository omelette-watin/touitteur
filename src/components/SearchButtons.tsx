import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactChild, useEffect, useState } from "react"

const SearchButton = ({
  children,
  link,
  active = false,
}: {
  children: ReactChild
  link: string
  active?: boolean
}) => {
  return (
    <Link href={link}>
      <a
        className={classNames(
          "relative flex-1 px-4 py-3 text-center font-bold transition-colors ease-in-out hover:bg-neutral-900/50",
          { "text-slate-200": active }
        )}
      >
        {children}
        <div
          className={classNames(
            "bg-twitter absolute bottom-0 left-1/2 h-1 w-[70%] -translate-x-1/2 transform rounded-sm",
            {
              hidden: !active,
            }
          )}
        />
      </a>
    </Link>
  )
}
const SearchButtons = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("")

  useEffect(() => {
    setSearchTerm(router.query.q as string)
    setSearchType((router.query.t as string) || "tweets")

    return () => {
      setSearchTerm("")
      setSearchType("")
    }
  }, [router])

  return (
    <div className="flex items-center justify-around pt-3">
      <SearchButton
        link={`/search?q=${encodeURIComponent(searchTerm)}&t=tweets`}
        active={searchType === "tweets"}
      >
        Tweets
      </SearchButton>
      <SearchButton
        link={`/search?q=${encodeURIComponent(searchTerm)}&t=users`}
        active={searchType === "users"}
      >
        People
      </SearchButton>
      <SearchButton
        link={`/search?q=${encodeURIComponent(searchTerm)}&t=hashtags`}
        active={searchType === "hashtags"}
      >
        Hashtags
      </SearchButton>
    </div>
  )
}

export default SearchButtons
