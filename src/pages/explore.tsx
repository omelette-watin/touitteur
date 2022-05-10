import api from "@/api/api"
import FollowSuggestions from "@/components/FollowSuggestions"
import MainWrapper from "@/components/MainWrapper"
import Scroller from "@/components/Scroller"
import TrendingHashtags from "@/components/TrendingHashtags"
import Tweet from "@/components/Tweet"
import Loading from "@/components/ui/Loading"
import usePostedTweets from "@/hooks/usePostedTweets"
import { TweetEventType, TweetType } from "@/types/tweet"
import type { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Explore = () => {
  const router = useRouter()
  const { postedTweets, setPostedTweets } = usePostedTweets()
  const [loading, setLoading] = useState(true)
  const [tweets, setTweets] = useState<TweetEventType[] | TweetType[] | []>([])
  const [hasMore, setHasMore] = useState(true)
  const loadMore = async () => {
    const lastId = tweets[tweets.length - 1]?.id
    const url = `/tweets?cursor=${lastId}`

    api.get(url).then(({ data }) => {
      if (data.length) {
        setTweets(tweets.concat(data))
      } else {
        setHasMore(false)
      }
    })
  }

  useEffect(() => {
    api.get("/tweets").then(({ data }) => {
      if (data.length) {
        setTweets(data)
      } else {
        setHasMore(false)
      }

      setLoading(false)
    })
  }, [router])

  useEffect(() => {
    setPostedTweets([])
  }, [router, setPostedTweets])

  return (
    <MainWrapper title="Explore">
      <>
        <div className="border-b border-gray-700">
          <TrendingHashtags />
        </div>
        <div className="border-b border-gray-700">
          <FollowSuggestions take={8} />
        </div>
        <div className="py-3">
          <h1 className="px-4 text-xl font-extrabold text-slate-200">Tweets</h1>
          {postedTweets?.length > 0 &&
            postedTweets
              .map((tweet) => {
                return <Tweet element={tweet} key={tweet.id} />
              })
              .reverse()}
          {loading && (
            <div className="my-8 flex w-full justify-center">
              <Loading color="#00AAEC" />
            </div>
          )}
          {tweets.length === 0 && !loading && (
            <div className="mt-8 flex w-full justify-center text-xs text-gray-400 sm:text-base">
              No results ...
            </div>
          )}
          {tweets.length > 0 && (
            <Scroller tweets={tweets} loadMore={loadMore} hasMore={hasMore} />
          )}
        </div>
      </>
    </MainWrapper>
  )
}

export default Explore

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: "Explore",
      needAuth: true,
    },
  }
}
