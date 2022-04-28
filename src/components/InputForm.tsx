import classNames from "classnames"
import { useState } from "react"
import { useField } from "formik"

const InputForm = (props: any) => {
  const [field, meta] = useField(props)
  const [didFocus, setDidFocus] = useState(false)
  const handleFocus = () => setDidFocus(true)
  const showFeedback =
    (!!didFocus && field.value.trim().length > 2) || meta.touched

  return (
    <>
      <div className={`relative`}>
        <span
          className={classNames(
            "z-2 absolute inset-y-0 right-2 ml-2 flex items-center",
            {
              "text-lg font-extrabold text-green-500":
                !meta.error && meta.value,
              "text-md font-semibold text-orange-500":
                meta.error || !meta.value,
            }
          )}
        >
          {!meta.error && showFeedback ? "✓" : "*"}
        </span>
        <input
          {...props}
          {...field}
          className={classNames(
            "text-md my-2 w-52 rounded-md py-1 px-3 font-medium placeholder:font-medium md:w-64 xl:w-80 xl:py-2",
            {
              "border-[2px] border-orange-500 outline-none":
                showFeedback && meta.error,
            }
          )}
          aria-describedby={`${props.id}-feedback ${props.id}-help`}
          onFocus={handleFocus}
        />
      </div>
      {showFeedback && meta.error ? (
        <div className="space-between bounce ml-1 -mt-1 flex w-48 items-center xl:w-72">
          <p
            id={`${props.id}-feedback`}
            aria-live="polite"
            className="text-sm text-orange-500"
          >
            {meta.error}
          </p>
        </div>
      ) : null}
    </>
  )
}

export default InputForm
