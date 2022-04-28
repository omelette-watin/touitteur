import api from "@/api/api"
import useModal from "@/hooks/useModal"
import { TweetType } from "@/types/tweet"
import classNames from "classnames"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Form } from "usetheform"
import CharacterCounter from "./CharacterCounter"
import EmojiPicker from "./EmojiPicker"
import PrivacyPicker from "./PrivacyPicker"
import TweetInput, { EditorActionHandle } from "./TweetInput"
import SubmitButton from "./SubmitButton"
import Tooltip from "./ui/Tooltip"
import useAuth from "@/hooks/useAuth"
import usePostedTweets from "@/hooks/usePostedTweets"

const MAX_CHARS_ALLOWED = 140
const TweetForm = ({ replying }: { replying: TweetType | null }) => {
  const { user } = useAuth()
  const { postedTweets, setPostedTweets } = usePostedTweets()
  const { modal, setModal } = useModal()
  const [clicked, setClicked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const refEditor = useRef<EditorActionHandle>(null)
  const onSubmit = async (state: { editor: { plainText: string } }) => {
    setSubmitting(true)
    const {
      editor: { plainText },
    } = state

    if (!replying) {
      api.post("/tweets", { plainText }).then(({ data }) => {
        refEditor.current?.reset()
        const newTweet = {
          id: data.tweetId,
          plainText,
          createdAt: new Date(),
          _count: {
            replies: 0,
            likes: 0,
            retweets: 0,
          },
          author: {
            id: user?.id,
            username: user?.username,
            profileName: user?.profileName,
            urlAvatar: user?.urlAvatar,
          },
        }
        setPostedTweets(postedTweets.concat(newTweet))
        setSubmitting(false)
      })
    } else {
      api
        .post(`/tweets/${replying.id}/reply`, { plainText })
        .then(({ data }) => {
          refEditor.current?.reset()
          const newTweet = {
            id: data.tweetId,
            plainText,
            createdAt: new Date(),
            _count: {
              replies: 0,
              likes: 0,
              retweets: 0,
            },
            author: {
              id: user?.id,
              username: user?.username,
              profileName: user?.profileName,
              urlAvatar: user?.urlAvatar,
            },
            orginalTweet: {
              tweetId: replying.id,
              author: {
                username: replying.author.username,
              },
            },
          }
          setPostedTweets(postedTweets.concat(newTweet))
          setSubmitting(false)
        })
    }

    if (modal) {
      setModal("")
    }
  }
  useEffect(() => {
    if (refEditor.current) {
      if (modal) {
        refEditor.current.focus()
      }
    }
  }, [modal])

  return (
    <Form
      onSubmit={onSubmit}
      className="max-w-[80%] flex-grow sm:max-w-[90%]"
      onClick={() => setClicked(true)}
    >
      <TweetInput
        ref={refEditor}
        maxChars={MAX_CHARS_ALLOWED}
        placeholder={replying ? "Tweet your reply" : "What's happening ?"}
      />
      {(clicked || modal) && <PrivacyPicker />}
      <div
        className={classNames(
          "mt-2 flex justify-between border-gray-700 pr-2",
          {
            "border-t pt-3": clicked || modal,
          }
        )}
      >
        <div className="flex items-center">
          <EmojiPicker />
          <div className="hover:bg-twitter/10 group relative flex items-center justify-center rounded-full p-2 transition ease-in-out">
            <Image
              src="/imageupload.svg"
              width={24}
              height={24}
              alt="Add emoji"
              className="h-[24px] w-[24px]"
            />
            <Tooltip>Choose an image</Tooltip>
          </div>
          <div className="hover:bg-twitter/10 group relative flex items-center justify-center rounded-full p-2 transition ease-in-out">
            <Image
              src="/gifupload.svg"
              width={24}
              height={24}
              alt="Add emoji"
              className="h-[24px] w-[24px]"
            />
            <Tooltip>Choose a gif</Tooltip>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <CharacterCounter maxChars={MAX_CHARS_ALLOWED} />
          <SubmitButton submitting={submitting} />
        </div>
      </div>
    </Form>
  )
}

export default TweetForm
