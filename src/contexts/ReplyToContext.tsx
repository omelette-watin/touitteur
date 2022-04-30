import { ReplyToContextType } from "@/types/replyTo"
import { TweetType } from "@/types/tweet"
import { createContext, ReactChild, useState } from "react"

export const ReplyToContext = createContext<ReplyToContextType | null>({
  replyingTo: null,
  // eslint-disable-next-line no-unused-vars
  setReplyingTo(_tweet) {},
})

export const ReplyToContextProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [replyingTo, setReplyingTo] = useState<TweetType | null>(null)

  return (
    <ReplyToContext.Provider value={{ replyingTo, setReplyingTo }}>
      {children}
    </ReplyToContext.Provider>
  )
}
