import Image from "next/image"
import { useRouter } from "next/router"
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/outline"
import { ReactChild, useCallback } from "react"
import useAuth from "@/hooks/useAuth"

interface MainWrapperProps {
  children: ReactChild
  title: string
}

const MainWrapper = ({ children, title }: MainWrapperProps): JSX.Element => {
  const router = useRouter()
  const { user } = useAuth()
  const isHomePage = router.pathname === "/"
  const handleBack = useCallback(() => router.back(), [router])

  return (
    <div className="max-w-[100vw] flex-grow border-gray-700 sm:ml-[73px] sm:max-w-[40rem] sm:border-l sm:border-r xl:ml-[370px]">
      <div className="sticky top-0 z-20 flex h-16 items-center border-b border-gray-700 bg-black px-4 text-slate-200 sm:justify-between sm:px-4">
        <div className="flex items-center">
          {isHomePage ? (
            <div className="mr-2 sm:hidden">
              <Image
                src={user?.urlAvatar || "/avatars/default.svg"}
                alt="Your profile"
                className="h-[33px] w-[33px] rounded-full"
                width={36}
                height={36}
              />
            </div>
          ) : (
            <ArrowLeftIcon
              className="mr-2 h-5 text-white"
              onClick={handleBack}
            />
          )}
          <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        </div>
        <div className="hoverAnimation ml-auto flex h-9 w-9 items-center justify-center xl:px-0">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>
      {children}
    </div>
  )
}

export default MainWrapper
