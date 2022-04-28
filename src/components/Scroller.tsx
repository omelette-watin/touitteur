import InfiniteScroll from "react-infinite-scroll-component"
import Tweet from "./Tweet"
import Loading from "./ui/Loading"
import { TweetEventType, TweetType } from "@/types/tweet"

interface ScrollerProps {
  tweets: TweetType[] | [] | TweetEventType[]
  hasMore: boolean
  endMessage?: string
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
          return <Tweet element={tweet} key={tweet.id} />
        })}
    </InfiniteScroll>
  )
}

export default Scroller
