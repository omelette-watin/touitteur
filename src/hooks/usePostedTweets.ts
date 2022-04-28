import { PostedTweetContext } from "@/contexts/PostedTweetsContext"
import useContextAndErrorIfNull from "./useContextAndErrorIfNull"

const usePostedTweets = () => useContextAndErrorIfNull(PostedTweetContext)

export default usePostedTweets
