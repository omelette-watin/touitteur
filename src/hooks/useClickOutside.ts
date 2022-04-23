import { useEffect, useRef } from "react"

const useClickOutside = (handler) => {
  const domNode = useRef()

  useEffect(() => {
    const clickOutSide = (e) => {
      if (!domNode.current.contains(e.target)) {
        handler()
      }
    }

    document.addEventListener("mousedown", clickOutSide)

    return () => {
      document.removeEventListener("mousedown", clickOutSide)
    }
  }, [handler])

  return domNode
}

export default useClickOutside
