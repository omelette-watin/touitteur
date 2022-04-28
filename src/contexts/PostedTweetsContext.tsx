import { PostedTweetsContextType } from "@/types/postedTweets"
import { TweetType } from "@/types/tweet"
import { createContext, ReactChild, useState } from "react"

export const PostedTweetContext = createContext<PostedTweetsContextType | null>(
  null
)

export const PostedTweetContextProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [postedTweets, setPostedTweets] = useState<TweetType[] | []>([])

  return (
    <PostedTweetContext.Provider value={{ postedTweets, setPostedTweets }}>
      {children}
    </PostedTweetContext.Provider>
  )
}
