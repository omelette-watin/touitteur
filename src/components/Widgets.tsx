import Loading from "./ui/Loading"
import api from "@/api/api"
import Link from "next/link"
import { useState, useEffect } from "react"
const Widgets = () => {
  const [trendingHashtags, setTrendingHashtags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/hashtags/trending").then(({ data }) => {
      setTrendingHashtags(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="my-8 hidden lg:block">
      <div className="ml-2 flex max-h-fit w-[300px] flex-grow-0 flex-col rounded-lg bg-neutral-900/80 py-3 shadow-md md:ml-4">
        <h1 className="mb-4 px-4 text-xl font-extrabold text-slate-200">
          Trending Hashtags:
        </h1>
        <div className="text-center">
          {loading && <Loading color="#1d9bf0" />}
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
                    <p>{hashtag._count.tweets} tweets</p>
                  </a>
                </Link>
              )
            }
          )}
      </div>
    </div>
  )
}

export default Widgets
