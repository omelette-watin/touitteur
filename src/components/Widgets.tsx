import FollowSuggestions from "./FollowSuggestions"
import SearchBar from "./SearchBar"
import TrendingHashtags from "./TrendingHashtags"
import Widget from "./Widget"

const Widgets = () => {
  return (
    <div className="my-3 ml-4 hidden w-[350px] space-y-4 lg:block">
      <div className="sticky top-0 z-10 w-full bg-black py-2">
        <SearchBar side={true} />
      </div>
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
