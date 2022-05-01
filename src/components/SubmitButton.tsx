import { useForm } from "usetheform"
import Loading from "./ui/Loading"

const SubmitButton = ({
  submitting,
  replying,
}: {
  submitting: boolean
  replying: boolean
}) => {
  const { isValid, pristine, state } = useForm()
  const isEmpty = !state.editor?.plainText && !state.media && !state.gif

  return (
    <button
      className="bg-twitter hover:bg-twitter disabled:bg-twitter/50 flex cursor-pointer items-center rounded-full border-0 py-1 px-4 text-base font-semibold text-slate-200 transition-colors ease-in-out disabled:cursor-default disabled:text-slate-200/50 sm:text-lg"
      disabled={!isValid || pristine || isEmpty || submitting}
      type="submit"
    >
      <span>{submitting ? "Sending..." : replying ? "Reply" : "Tweet"}</span>
      {submitting && <Loading color={"#fff"} small />}
    </button>
  )
}

export default SubmitButton
