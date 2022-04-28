export interface UserType {
  id: string
  username: string
  profileName?: string
  createdAt?: string
  urlAvatar: string
  bio?: string | null
  likes: string[]
  retweets: string[]
  following: string[]
  stats: {
    followers: number
    following: number
    tweets: number
    retweets: number
  }
}
