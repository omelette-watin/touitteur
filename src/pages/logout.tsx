import GalaxyBackground from "@/components/GalaxyBackground"
import { useRouter } from "next/router"
import api from "@/api/api"
import Image from "next/image"
import Head from "next/head"
import { useCallback } from "react"

const Logout = () => {
  const router = useRouter()
  const cancel = useCallback(() => {
    router.back()
  }, [router])
  const logout = useCallback(() => {
    api
      .post("/auth/logout")
      .then(() => {
        localStorage.removeItem("token")
        delete api.defaults.headers["x-access-token"]
        router.push("/login")
      })
      .catch(() => {
        router.push("/login")
      })
  }, [router])

  return (
    <GalaxyBackground>
      <Head>
        <title>Log out - Twouitteur</title>
      </Head>
      <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-900/[.85] px-8 py-8 text-slate-200 shadow-md">
        <Image
          src="/twouitteur.svg"
          width={50}
          height={50}
          alt="twouitteur logo"
        />
        <h2 className="my-10 text-2xl font-semibold">
          Log out of Twouitteur ?
        </h2>

        <button
          className="mb-5 block h-[52px] w-56 rounded-full bg-slate-200 text-lg font-bold text-black shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-slate-300"
          onClick={logout}
        >
          Log out
        </button>
        <button
          className="block h-[52px] w-56 rounded-full border-[1px] border-slate-200 bg-black text-lg font-bold shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-neutral-900"
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </GalaxyBackground>
  )
}

export default Logout
