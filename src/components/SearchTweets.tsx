import api from "@/api/api"
import { TweetType } from "@/types/tweet"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Scroller from "./Scroller"
import Loading from "./ui/Loading"

const SearchTweets = ({ searchTerm = "" }: { searchTerm: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tweets, setTweets] = useState<TweetType[] | []>([])
  const [hasMore, setHasMore] = useState(true)
  const loadMore = async () => {
    const lastId = tweets[tweets.length - 1]?.id

    api
      .get(`/tweets/search/${encodeURIComponent(searchTerm)}?cursor=${lastId}`)
      .then(({ data }) => {
        if (data.length) {
          setTweets(tweets.concat(data))
        } else {
          setHasMore(false)
        }
      })
  }

  useEffect(() => {
    api
      .get(`/tweets/search/${encodeURIComponent(searchTerm)}`)
      .then(({ data }) => {
        if (data.length) {
          setTweets(data)
        } else {
          setHasMore(false)
        }

        setLoading(false)
      })

    return () => {
      setTweets([])
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
      {tweets.length === 0 && !loading && (
        <div className="mt-8 flex w-full justify-center text-xs text-gray-400 sm:text-base">
          No results for "{searchTerm}" ...
        </div>
      )}
      {tweets.length > 0 && (
        <Scroller tweets={tweets} loadMore={loadMore} hasMore={hasMore} />
      )}
    </div>
  )
}

export default SearchTweets
