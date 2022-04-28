import { ReplyToContext } from "@/contexts/ReplyToContext"
import useContextAndErrorIfNull from "./useContextAndErrorIfNull"

const useReplyTo = () => useContextAndErrorIfNull(ReplyToContext)

export default useReplyTo
