import Link from "next/link"
import Image from "next/image"
import GalaxyBackground from "./GalaxyBackground"
import Head from "next/head"

const ConnectionScreen = () => {
  return (
    <GalaxyBackground>
      <Head>
        <title>Touitteur</title>
      </Head>
      <div className="flex flex-col items-center justify-center text-white xl:flex-row">
        <Image
          src="/twouitteur-white.svg"
          width={50}
          height={50}
          alt="twouitteur logo"
        />
        <div className="my-10 text-3xl xl:mr-[80px] xl:ml-8">
          We were waiting for you !
        </div>
        <div className="flex flex-col items-center space-y-3">
          <Link href="/login">
            <a>
              <button className="bg-twitter block h-[52px] w-56 rounded-full text-lg font-bold shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-[#1a8cd8]">
                Sign-in
              </button>
            </a>
          </Link>
          <div className="text-l">Don't have an account?</div>
          <Link href="/register">
            <a>
              <button className="block h-[52px] w-56 rounded-full bg-white text-lg font-bold text-black shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-slate-300">
                Sign-up
              </button>
            </a>
          </Link>
        </div>
      </div>
    </GalaxyBackground>
  )
}

export default ConnectionScreen
