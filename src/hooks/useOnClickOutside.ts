/* eslint-disable no-unused-vars */
import { useEffect, RefObject, KeyboardEvent } from "react"

type Event = MouseEvent | TouchEvent | any

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current

      if (event.key && event.key === "Escape") {
        handler(event)
      }

      if (!el || el.contains((event?.target as Node) || null)) {
        return
      }

      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    document.addEventListener("keydown", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
      document.removeEventListener("keydown", listener)
    }
  }, [ref, handler])
}

export default useOnClickOutside
