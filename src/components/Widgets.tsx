import FollowSuggestions from "./FollowSuggestions"
import TrendingHashtags from "./TrendingHashtags"
import Widget from "./Widget"

const Widgets = () => {
  return (
    <div className="my-8 ml-4 hidden w-[350px] space-y-8 lg:block">
      <Widget>
        <TrendingHashtags />
      </Widget>
      <Widget>
        <FollowSuggestions />
      </Widget>
    </div>
  )
}

export default Widgets
