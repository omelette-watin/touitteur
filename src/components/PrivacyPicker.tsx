import Image from "next/image"
import { ReactChild, useEffect, useRef, useState } from "react"
import { useSelector, Input } from "usetheform"
import privacy0 from "@@/public/privacy-world.svg"
import privacy1 from "@@/public/privacy-following.svg"
import privacy2 from "@@/public/privacy-mentionned.svg"
import useOnClickOutside from "@/hooks/useOnClickOutside"

interface RadioWithLabelProps {
  id: string
  img: string
  name?: string
  children: ReactChild
  value: string
  checked?: boolean
}

const labels = ["Everyone", "People you follows", "Only people you mention"]
const RadioWithLabel = ({
  id,
  img,
  name = "postPrivacy",
  children,
  value,
  checked,
}: RadioWithLabelProps) => {
  return (
    <div className="flex items-center">
      <Input
        type="radio"
        className="hidden"
        id={id}
        name={name}
        value={value}
        checked={checked}
      />
      <label
        className="hover:bg-twitter/10 relative flex cursor-pointer items-center space-x-2 rounded-full py-1 pl-2 pr-3"
        htmlFor={id}
      >
        <Image alt="privacy" src={img} />
        <span>{children}</span>
      </label>
    </div>
  )
}
const PrivacyPicker = () => {
  const [visible, setVisibility] = useState(false)
  const [postPrivacy] = useSelector(
    (state: { postPrivacy: any }) => state.postPrivacy
  )
  const label = labels[postPrivacy] || labels[0]
  const bntLabel = `${label} can reply`
  const closePicker = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setVisibility(false)
  }
  // const openPicker = (e: { stopPropagation: () => void }) => {
  //   e.stopPropagation()
  //   setVisibility(true)
  // }
  const refPicker = useRef<HTMLDivElement>(null)
  useOnClickOutside(refPicker, closePicker)

  useEffect(() => {
    if (postPrivacy !== undefined) {
      setVisibility(false)
    }
  }, [postPrivacy])

  return (
    <div className="relative">
      <button
        type="button"
        className="text-twitter hover:bg-twitter/10 flex items-center space-x-2 rounded-full py-1 pl-2 pr-3 text-sm"
        // onClick={openPicker}
      >
        <Image
          alt={bntLabel}
          src={"/privacy-world.svg"}
          width={24}
          height={24}
        />
        <span>{bntLabel}</span>
      </button>
      <div
        ref={refPicker}
        data-visible={visible}
        className={`absolute top-12 z-10 rounded border-[1px] border-gray-700 bg-black py-3 px-3 shadow-md ${
          visible ? "block" : "hidden"
        }`}
      >
        <div className="py-0 px-2 font-bold">Who can reply?</div>
        <div className="py-0 px-2">
          Choose who can reply to this Tweet. Anyone mentioned can always reply.
        </div>
        <div className="mt-3 space-y-2">
          <RadioWithLabel img={privacy0} id="everyone" value="0" checked>
            {labels[0]}
          </RadioWithLabel>
          <RadioWithLabel img={privacy1} id="onlyfollower" value="1">
            {labels[1]}
          </RadioWithLabel>
          <RadioWithLabel img={privacy2} id="onlymentioned" value="2">
            {labels[2]}
          </RadioWithLabel>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPicker
