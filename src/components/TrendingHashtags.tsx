import api from "@/api/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import Loading from "./ui/Loading"

const TrendingHashtags = () => {
  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [loadingHashtag, setLoadingHashtags] = useState(true)

  useEffect(() => {
    api.get("/hashtags/trending").then(({ data }) => {
      setTrendingHashtags(data)
      setLoadingHashtags(false)
    })
  }, [])

  return (
    <div className="flex flex-col rounded-lg py-3">
      <h1 className="mb-2 px-4 text-xl font-extrabold text-slate-200">
        Trending Hashtags
      </h1>
      <div className="text-center">
        {loadingHashtag && <Loading color="#1d9bf0" />}
      </div>
      {trendingHashtags.length > 0 &&
        trendingHashtags.map(
          (hashtag: {
            name: string
            _count: { tweets: number }
            id: string
          }) => {
            return (
              <Link href={`/hashtag/${hashtag.name}`} key={hashtag.id}>
                <a className="px-4 py-2 transition-colors ease-in-out hover:bg-neutral-800">
                  <h3 className="text-lg font-bold text-slate-200">
                    #{hashtag.name}
                  </h3>
                  <p>
                    {hashtag._count.tweets} tweet
                    {hashtag._count.tweets > 1 && "s"}
                  </p>
                </a>
              </Link>
            )
          }
        )}
    </div>
  )
}

export default TrendingHashtags
