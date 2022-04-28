import { useSelector } from "usetheform"
import { EditorState, Modifier } from "draft-js"
import useOnClickOutside from "@/hooks/useOnClickOutside"
import Image from "next/image"
import { useRef, useState } from "react"
import { IEmojiPickerProps } from "emoji-picker-react"
import Tooltip from "./ui/Tooltip"
let Picker: React.FC<IEmojiPickerProps>

if (typeof window !== "undefined") {
  import("emoji-picker-react").then((_module) => {
    Picker = _module.default
  })
}

const EmojiPicker = () => {
  const [showEmojiPicker, togglePicker] = useState(false)
  const [editor, setEditor] = useSelector(
    (state: { editor: any }) => state.editor
  )
  const closeEmojiPicker = () => togglePicker(false)
  const toggleEmojiPicker = () => togglePicker((prev) => !prev)
  const onEmojiClick = (
    e: { preventDefault: () => void },
    emojiObj: { emoji: string }
  ) => {
    e.preventDefault()
    const { editorState } = editor
    const contentState = editorState?.getCurrentContent()
    const targetRange = editorState?.getSelection()
    const modifierAPI = targetRange.isCollapsed()
      ? Modifier.insertText
      : Modifier.replaceText
    const newContentState = modifierAPI(
      contentState,
      targetRange,
      emojiObj.emoji
    )
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    )
    setEditor((prev: any) => ({ ...prev, editorState: newEditorState }))
  }
  const refPicker = useRef<HTMLDivElement>(null)
  useOnClickOutside(refPicker, closeEmojiPicker)

  return (
    <div ref={refPicker} className="relative">
      <button
        type="button"
        className={
          "hover:bg-twitter/10 group relative flex items-center justify-center rounded-full p-2 transition ease-in-out"
        }
        onClick={toggleEmojiPicker}
      >
        <Image
          src="/emoji-picker.svg"
          width={24}
          height={24}
          alt="Add emoji"
          className="h-[24px] w-[24px]"
        />
        <Tooltip>Choose an emoji</Tooltip>
      </button>
      {showEmojiPicker && (
        <div className="absolute z-10 text-black">
          <Picker
            onEmojiClick={onEmojiClick}
            preload
            pickerStyle={{
              boxShadow: "none",
            }}
          />
        </div>
      )}
    </div>
  )
}
export default EmojiPicker
