import { TweetType } from "./tweet"

/* eslint-disable no-unused-vars */
export interface ReplyToContextType {
  replyingTo: TweetType | null
  setReplyingTo: (tweet: TweetType | null) => void
}
