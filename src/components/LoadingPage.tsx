import Image from "next/image"

const LoadingPage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Image
        src="/twouitteur.svg"
        width={80}
        height={80}
        alt="Touitteur's log"
      />
    </div>
  )
}

export default LoadingPage
