import InfiniteScroll from "react-infinite-scroll-component"
import { Suggestion } from "./FollowSuggestions"
import { TrendingHashtag } from "./TrendingHashtags"
import Tweet from "./Tweet"
import Loading from "./ui/Loading"

interface ScrollerProps {
  tweets: any[]
  hasMore: boolean
  endMessage?: string
  type?: "tweet" | "user" | "hashtag"
  loadMore: () => void
}

const Loader = (
  <div className="my-8 flex w-full justify-center">
    <Loading color="#00AAEC" />
  </div>
)
const Scroller = ({
  loadMore,
  tweets,
  hasMore,
  type = "tweet",
  endMessage = "Nothing else to show for now...",
}: ScrollerProps) => {
  const EndMessage = (
    <div className="mt-8 flex w-full justify-center text-xs text-gray-400 sm:text-base">
      {endMessage}
    </div>
  )

  return (
    <InfiniteScroll
      next={loadMore}
      dataLength={tweets.length}
      loader={Loader}
      hasMore={hasMore}
      endMessage={EndMessage}
      style={{
        overflowY: "hidden",
        paddingBottom: "80px",
        maxWidth: "100%",
      }}
    >
      {tweets.length > 0 &&
        tweets.map((tweet) => {
          if (type === "tweet") {
            return <Tweet element={tweet} key={tweet.id} />
          }

          if (type === "user") {
            return <Suggestion user={tweet} key={tweet.id} />
          }

          if (type === "hashtag") {
            return <TrendingHashtag hashtag={tweet} key={tweet.id} />
          }
        })}
    </InfiniteScroll>
  )
}

export default Scroller
