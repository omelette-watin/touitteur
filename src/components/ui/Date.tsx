import ReactTimeAgo from "react-time-ago"
import { parseISO, format } from "date-fns"

export const DateTwitterStyle = ({ date }: { date: Date }) => {
  return (
    <time>
      <ReactTimeAgo date={date} locale="en-US" timeStyle="twitter" />
    </time>
  )
}

export const DateClassic = ({ date }: { date: string }) => {
  return <time>{format(parseISO(date), "H:m · MMM d, y")}</time>
}
