import { TweetType } from "./tweet"

/* eslint-disable no-unused-vars */
export interface PostedTweetsContextType {
  postedTweets: TweetType[] | []
  setPostedTweets: (tweet: TweetType[] | []) => void
}
