import stopPropagation from "@/utils/stopPropagation"
import classNames from "classnames"
import Link from "next/link"

const HighlightedTweet = (str: string) => {
  const parts = str.split(
    /\B([#|@][0-9A-Za-zÀ-ÖØ-öø-ÿ_-]+)(?![0-9A-Za-zÀ-ÖØ-öø-ÿ_-])/g
  )
  const hashtags = str.match(
    /\B(#[0-9A-Za-zÀ-ÖØ-öø-ÿ_-]+)(?![0-9A-Za-zÀ-ÖØ-öø-ÿ_-])/g
  )
  const mentions = str.match(
    /\B(@[0-9A-Za-zÀ-ÖØ-öø-ÿ_-]+)(?![0-9A-Za-zÀ-ÖØ-öø-ÿ_-])/g
  )
  const isMention = (str: string) => mentions?.includes(str)
  const isHashtag = (str: string) => hashtags?.includes(str)
  const isHashtagOrMention = (str: string) => isMention(str) || isHashtag(str)

  return (
    <span>
      {parts.map((part, i) => {
        return (
          <span
            key={i}
            className={classNames({
              "text-twitter": isHashtagOrMention(part),
            })}
          >
            {isHashtagOrMention(part) ? (
              <Link
                href={`${
                  isHashtag(part) ? "/hashtag" : "/user"
                }/${part.substring(1)}`}
              >
                <a
                  onClick={(e) => {
                    stopPropagation(e)
                  }}
                  className="underline-offset-1 hover:underline"
                >
                  {part}
                </a>
              </Link>
            ) : (
              part
            )}
          </span>
        )
      })}
    </span>
  )
}

export default HighlightedTweet
