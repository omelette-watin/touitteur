import {
  forwardRef,
  RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react"
import { Collection, Input, useField } from "usetheform"
import { EditorState, Editor, CompositeDecorator } from "draft-js"
import HighlightedText from "./ui/HighlightedText"

interface TweetInputProps {
  maxChars: number
  placeholder: string
  name?: string
}

export type RefType = RefObject<HTMLElement>

export type EditorActionHandle = {
  focus: () => void
  reset: () => void
}

const limitTo = (limit: number) => (editorState: { plainText: string }) => {
  const { length = 0 } = editorState?.plainText || ""

  return length <= 0 || length > limit ? "out of limits" : undefined
}
const extractPlainText = (editor: { editorState: any }) => {
  const editorState = editor?.editorState
  const currentContent = editorState?.getCurrentContent?.()
  const plainText = currentContent?.getPlainText?.("") || ""

  return { ...editor, plainText }
}
const createHighlightDecorator = (regex: RegExp) => {
  const tagStrategy = (
    contentBlock: { getText: () => any },
    // eslint-disable-next-line no-unused-vars
    callback: (arg0: number, arg1: number) => void
  ) => {
    const text = contentBlock.getText()
    let matchArr, start

    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index
      callback(start, start + matchArr[0].length)
    }
  }

  return {
    strategy: tagStrategy,
    component: HighlightedText,
  }
}
const detectHashtag = /\B(#[0-9A-Za-zÀ-ÖØ-öø-ÿ_-]+)(?![0-9A-Za-zÀ-ÖØ-öø-ÿ_-])/g
const detectMention = /\B(@[0-9A-Za-zÀ-ÖØ-öø-ÿ_-]+)(?![0-9A-Za-zÀ-ÖØ-öø-ÿ_-])/g
const detectURL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
const composeDecorators = () =>
  new CompositeDecorator([
    createHighlightDecorator(detectHashtag),
    createHighlightDecorator(detectMention),
    createHighlightDecorator(detectURL),
  ])
// eslint-disable-next-line react/display-name
const DraftEditor = forwardRef<EditorActionHandle, TweetInputProps>(
  ({ placeholder, name = "editorState" }, ref) => {
    const initialState = EditorState.createEmpty(composeDecorators())
    const { value, setValue } = useField({
      type: "custom",
      name,
      value: initialState,
    })
    const onInputChange = useCallback(
      (editorState: any) => setValue(editorState),
      [setValue]
    )
    const refEditor = useRef(null)
    useField({
      type: "custom",
      name: "refEditor",
      value: refEditor,
    })

    useImperativeHandle(ref, () => ({
      reset() {
        setValue(() => EditorState.createEmpty(composeDecorators()))
      },
      focus() {
        setValue(() => EditorState.moveFocusToEnd(value))
      },
    }))

    return (
      <div
        className={
          "relative block min-h-[24px] overflow-hidden py-3 pl-3 text-left text-lg text-white"
        }
      >
        <Editor
          editorState={value}
          onChange={onInputChange}
          placeholder={placeholder}
          ref={refEditor}
        />
      </div>
    )
  }
)
// eslint-disable-next-line react/display-name
const TweetInput = forwardRef<EditorActionHandle, TweetInputProps>(
  ({ maxChars, placeholder }, ref) => {
    return (
      <>
        <Collection
          object
          name="editor"
          validators={[limitTo(maxChars)]}
          reducers={extractPlainText}
        >
          <DraftEditor
            ref={ref}
            name="editorState"
            maxChars={maxChars}
            placeholder={placeholder}
          />
          <Input type="hidden" name="plainText" />
        </Collection>
      </>
    )
  }
)

export default TweetInput
