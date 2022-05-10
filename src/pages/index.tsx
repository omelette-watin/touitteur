import api from "@/api/api"
import MainWrapper from "@/components/MainWrapper"
import Scroller from "@/components/Scroller"
import Tweet from "@/components/Tweet"
import Loading from "@/components/ui/Loading"
import WhatsHappeningBox from "@/components/WhatsHappeningBox"
import useAuth from "@/hooks/useAuth"
import usePostedTweets from "@/hooks/usePostedTweets"
import { TweetEventType, TweetType } from "@/types/tweet"
import type { GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Home: NextPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { postedTweets, setPostedTweets } = usePostedTweets()
  const [loading, setLoading] = useState(true)
  const [tweets, setTweets] = useState<TweetEventType[] | TweetType[] | []>([])
  const [hasMore, setHasMore] = useState(true)
  const followsSomeone = user?.following?.length ? true : false
  const loadMore = async () => {
    const lastId = tweets[tweets.length - 1]?.id
    let url

    if (followsSomeone) {
      url = `/tweets/myfeed?cursor=${lastId}`
    } else {
      url = `/tweets?cursor=${lastId}`
    }

    api.get(url).then(({ data }) => {
      if (data.length) {
        setTweets(tweets.concat(data))
      } else {
        setHasMore(false)
      }
    })
  }

  useEffect(() => {
    if (followsSomeone) {
      api.get("/tweets/myfeed").then(({ data }) => {
        if (data.length) {
          setTweets(data)
        } else {
          setHasMore(false)
        }

        setLoading(false)
      })
    } else {
      api.get("/tweets").then(({ data }) => {
        if (data.length) {
          setTweets(data)
        } else {
          setHasMore(false)
        }

        setLoading(false)
      })
    }
  }, [router, followsSomeone])

  useEffect(() => {
    setPostedTweets([])
  }, [router, setPostedTweets])

  return (
    <MainWrapper title={"Home"}>
      <>
        <WhatsHappeningBox />
        {postedTweets?.length > 0 &&
          postedTweets
            .map((tweet) => {
              return <Tweet element={tweet} key={tweet.id} />
            })
            .reverse()}
        {!followsSomeone && (
          <div className="flex flex-col items-center border-b border-gray-700 p-4 py-2 text-center">
            <p>You don't follow anyone yet</p>
            <p>Here, some recommendation for you</p>
          </div>
        )}
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
      </>
    </MainWrapper>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: "Home",
      needAuth: true,
    },
  }
}
