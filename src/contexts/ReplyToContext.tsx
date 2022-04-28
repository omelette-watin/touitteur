import { ReplyToContextType } from "@/types/replyTo"
import { TweetType } from "@/types/tweet"
import { createContext, ReactChild, useState } from "react"

export const ReplyToContext = createContext<ReplyToContextType | null>(null)

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
