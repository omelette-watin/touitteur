import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import GalaxyBackground from "@/components/GalaxyBackground"
import Loading from "@/components/ui/Loading"
import api from "@/api/api"
import Head from "next/head"
import { Formik, Form } from "formik"
import { object, string } from "yup"
import InputForm from "@/components/InputForm"
import { useRouter } from "next/router"
import useAuth from "@/hooks/useAuth"
import { CommonHeaderProperties } from "@/contexts/AuthContext"

const Login = () => {
  const [submitting, setSubmitting] = useState(false)
  const { setUser } = useAuth()
  const router = useRouter()

  return (
    <GalaxyBackground>
      <Head>
        <title>Sign in - Twouitteur</title>
      </Head>
      <div className="fadeUp flex flex-col items-center justify-center space-y-6 rounded-lg bg-neutral-900/[.85] px-8 pt-8 pb-2 text-slate-200 shadow-md">
        <Image
          src="/twouitteur.svg"
          width={50}
          height={50}
          alt="twouitteur logo"
        />
        <h2 className="text-3xl font-semibold">Sign-in</h2>
        <Formik
          initialValues={{
            usernameOrEmail: "",
            password: "",
          }}
          validationSchema={object({
            usernameOrEmail: string().required("Required"),
            password: string().required("Required"),
          })}
          onSubmit={async (values, { setErrors }: { setErrors: any }) => {
            setSubmitting(true)
            api
              .post("auth/login", values)
              .then(async (res) => {
                const token = res.data.token
                localStorage.setItem("token", token)
                ;(
                  api.defaults.headers! as unknown as Record<
                    string,
                    CommonHeaderProperties
                  >
                ).common["x-access-token"] = token

                const { data } = await api.get("/users/me")

                setUser(data)

                router.push("/")
              })
              .catch((err) => {
                if (
                  err.response &&
                  err.response.data === "Invalid Credentials"
                ) {
                  setErrors({
                    credentials: "Invalid Credentials",
                  })
                } else {
                  setErrors({ server: true })
                }

                setSubmitting(false)
              })
          }}
        >
          {({
            errors,
            dirty,
            isValid,
          }: {
            errors: any
            dirty: boolean
            isValid: boolean
          }) => (
            <Form>
              <div className="flex flex-col text-black">
                <InputForm
                  type="text"
                  name="usernameOrEmail"
                  placeholder="Username or email"
                />
                <InputForm
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </div>
              {errors.credentials && (
                <div className="space-between bounce ml-1 flex w-48 items-center xl:w-72">
                  <p aria-live="polite" className="text-sm text-orange-500">
                    {errors.credentials}
                  </p>
                </div>
              )}
              {errors.server && (
                <div className="space-between bounce ml-1 flex w-48 items-center xl:w-72">
                  <p aria-live="polite" className="text-sm text-orange-500">
                    Something went wrong, please retry later
                  </p>
                </div>
              )}
              <div className="flex flex-col items-center space-y-3 py-8 text-slate-200">
                <button
                  className="bg-twitter block h-[52px] w-52 rounded-full text-lg font-bold shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-[#1a8cd8] disabled:scale-100 disabled:bg-neutral-500"
                  type="submit"
                  disabled={submitting || !dirty || !isValid}
                >
                  {submitting ? (
                    <span>
                      Sending ... <Loading color="white" small />
                    </span>
                  ) : (
                    "Sign-in"
                  )}
                </button>
                <div className="text-l">Don't have an account?</div>
                <Link href="/register">
                  <a>
                    <button className="block h-[52px] w-48 rounded-full bg-slate-200 text-lg font-bold text-black shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-slate-300">
                      Sign-up
                    </button>
                  </a>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </GalaxyBackground>
  )
}

export default Login
