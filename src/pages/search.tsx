import MainWrapper from "@/components/MainWrapper"
import SearchHashtags from "@/components/SearchHashtags"
import SearchTweets from "@/components/SearchTweets"
import SearchUsers from "@/components/SearchUsers"
import { GetServerSideProps } from "next"

interface SearchProps {
  search: string
  type: "tweets" | "users" | "hashtags"
}

const Search = ({ search, type }: SearchProps) => {
  return (
    <MainWrapper title="Search">
      <>
        {type === "tweets" && <SearchTweets searchTerm={search} />}
        {type === "users" && <SearchUsers searchTerm={search} />}
        {type === "hashtags" && <SearchHashtags searchTerm={search} />}
      </>
    </MainWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const search = query.q
  const type = query.t || "tweets"

  return {
    props: {
      title: `${search} - Touitteur search`,
      needAuth: true,
      search,
      type,
    },
  }
}

export default Search
