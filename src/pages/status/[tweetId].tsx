import api from "@/api/api"
import MainTweet from "@/components/MainTweet"
import MainWrapper from "@/components/MainWrapper"
import Scroller from "@/components/Scroller"
import Tweet from "@/components/Tweet"
import Loading from "@/components/ui/Loading"
import usePostedTweets from "@/hooks/usePostedTweets"
import { TweetType } from "@/types/tweet"
import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"

const TweetPage = ({ tweet }: { tweet: TweetType }) => {
  const { postedTweets } = usePostedTweets()
  const [loading, setLoading] = useState(true)
  const [tweets, setTweets] = useState<TweetType[] | []>([])
  const [originalTweets, setOriginalTweets] = useState<TweetType[] | []>([])
  const [hasMore, setHasMore] = useState(true)
  const [hasMoreOriginals, setHasMoreOriginals] = useState<string | boolean>(
    true
  )
  const loadOriginalTweet = async () => {
    api.get(`/tweets/${hasMoreOriginals}`).then(({ data }) => {
      setOriginalTweets(originalTweets.concat(data))
      setHasMoreOriginals(data.originalTweetId)
    })
  }
  const loadMoreReplies = async () => {
    const lastId = tweets[tweets.length - 1]?.id
    const url = `/tweets/${tweet.id}/replies?cursor=${lastId}`

    api.get(url).then(({ data }) => {
      if (data.length) {
        setTweets(tweets.concat(data))
      } else {
        setHasMore(false)
      }
    })
  }

  useEffect(() => {
    if (tweet._count.replies) {
      api.get(`/tweets/${tweet.id}/replies`).then(({ data }) => {
        if (data.length) {
          setTweets(data)
          setHasMore(true)
        } else {
          setHasMore(false)
        }
      })
    }

    setHasMoreOriginals(tweet.originalTweetId || false)
    setLoading(false)

    return () => {
      setTweets([])
      setHasMoreOriginals(true)
      setOriginalTweets([])
      setLoading(true)
    }
  }, [tweet])

  return (
    <MainWrapper title="Tweet">
      <>
        {tweet.originalTweetId && hasMoreOriginals && (
          <div className="mt-2- -mb-3 flex w-full justify-center">
            <button
              onClick={loadOriginalTweet}
              className="rounded-full bg-gray-600/50 px-4 py-1 text-xs underline-offset-2 transition ease-in-out hover:bg-gray-800/80 sm:text-sm lg:text-base"
            >
              Show previous tweet
            </button>
          </div>
        )}
        {originalTweets.length > 0 &&
          originalTweets
            .map((tweet) => {
              return <Tweet element={tweet} key={tweet.id} />
            })
            .reverse()}
        <MainTweet tweet={tweet} />
        {postedTweets.length > 0 &&
          postedTweets
            .filter((tweetPosted) => tweetPosted.originalTweet?.id === tweet.id)
            .map((tweetPosted) => {
              return <Tweet element={tweetPosted} key={tweet.id} />
            })}
        {loading && (
          <div className="my-8 flex w-full justify-center">
            <Loading color="#00AAEC" />
          </div>
        )}
        {tweets.length === 0 && !loading && (
          <div className="my-8 flex w-full justify-center text-xs text-gray-400 sm:text-base">
            This tweet has no reply yet
          </div>
        )}
        {tweets.length > 0 && (
          <Scroller
            loadMore={loadMoreReplies}
            hasMore={hasMore}
            tweets={tweets}
          />
        )}
      </>
    </MainWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const tweetId = params?.tweetId
  const { data: tweet } = await api.get(`/tweets/${tweetId}`)

  return {
    props: {
      title: `${tweet.author.profileName} on Touitteur: ${tweet.plainText}`,
      tweet,
      needAuth: true,
    },
  }
}

export default TweetPage
