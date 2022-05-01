import api from "@/api/api"
import MainWrapper from "@/components/MainWrapper"
import Scroller from "@/components/Scroller"
import Loading from "@/components/ui/Loading"
import { TweetType } from "@/types/tweet"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Hashtag = ({ hashtag }: { hashtag: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tweets, setTweets] = useState<TweetType[] | []>([])
  const [hasMore, setHasMore] = useState(true)
  const loadMore = async () => {
    const lastId = tweets[tweets.length - 1]?.id
    api.get(`/tweets/hashtag/${hashtag}?cursor=${lastId}`).then(({ data }) => {
      if (data.length) {
        setTweets(tweets.concat(data))
      } else {
        setHasMore(false)
      }
    })
  }

  useEffect(() => {
    api.get(`/tweets/hashtag/${hashtag}`).then(({ data }) => {
      if (data.length) {
        setTweets(data)
        setHasMore(true)
      } else {
        setHasMore(false)
      }

      setLoading(false)
    })

    return () => {
      setTweets([])
      setLoading(true)
    }
  }, [router, hashtag])

  return (
    <MainWrapper title={`#${hashtag}`}>
      <>
        {loading && (
          <div className="my-8 flex w-full justify-center">
            <Loading color="#00AAEC" />
          </div>
        )}
        {tweets.length === 0 && !loading && (
          <div className="mt-8 flex w-full justify-center text-xs text-gray-400 sm:text-base">
            No result for #{hashtag} ...
          </div>
        )}
        {tweets.length > 0 && (
          <Scroller loadMore={loadMore} hasMore={hasMore} tweets={tweets} />
        )}
      </>
    </MainWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const hashtag = params?.name

  return {
    props: {
      title: `#${hashtag}`,
      hashtag,
      needAuth: true,
    },
  }
}

export default Hashtag
