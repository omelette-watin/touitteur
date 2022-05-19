import api from "@/api/api"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Scroller from "./Scroller"
import Loading from "./ui/Loading"

const SearchHashtags = ({ searchTerm = "" }: { searchTerm: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hashtags, setHashtags] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const loadMore = async () => {
    const lastId = hashtags[hashtags.length - 1]?.id

    api
      .get(
        `/hashtags/search/${encodeURIComponent(searchTerm)}?cursor=${lastId}`
      )
      .then(({ data }) => {
        if (data.length) {
          setHashtags(hashtags.concat(data))
        } else {
          setHasMore(false)
        }
      })
  }

  useEffect(() => {
    api
      .get(`/hashtags/search/${encodeURIComponent(searchTerm)}`)
      .then(({ data }) => {
        if (data.length) {
          setHashtags(data)
        } else {
          setHasMore(false)
        }

        setLoading(false)
      })

    return () => {
      setHashtags([])
      setHasMore(true)
      setLoading(true)
    }
  }, [router, searchTerm])

  return (
    <div>
      {loading && (
        <div className="my-8 flex w-full justify-center">
          <Loading color="#00AAEC" />
        </div>
      )}
      {hashtags.length === 0 && !loading && (
        <div className="mt-8 flex w-full justify-center text-xs text-gray-400 sm:text-base">
          No results for "{searchTerm}" ...
        </div>
      )}
      {hashtags.length > 0 && (
        <Scroller
          tweets={hashtags}
          loadMore={loadMore}
          hasMore={hasMore}
          type="hashtag"
        />
      )}
    </div>
  )
}

export default SearchHashtags
