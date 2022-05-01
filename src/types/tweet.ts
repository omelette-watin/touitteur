import { UserType } from "./user"

export interface TweetType {
  id: string
  plainText: string
  authorId?: string
  author: UserType
  type?: string
  createdAt: Date | string
  _count: { likes: number; retweets: number; replies: number }
  originalTweetId?: string | null
  originalTweet?:
    | TweetType
    | null
    | { id: string; author: { username: string } }
}

export interface TweetEventType {
  id: string
  authorId: string
  author: UserType
  createdAt: Date | string
  targetTweetId: string
  targetTweet: TweetType
  type: "tweet" | "reply" | "like" | "retweet"
}
