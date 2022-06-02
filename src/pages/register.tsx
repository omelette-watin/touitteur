import { Formik, Form } from "formik"
import { useState } from "react"
import Image from "next/image"
import { object, ref, string } from "yup"
import Loading from "@/components/ui/Loading"
import Link from "next/link"
import Head from "next/head"
import api from "@/api/api"
import { useRouter } from "next/router"
import InputForm from "@/components/InputForm"
import useAuth from "@/hooks/useAuth"
import GalaxyBackground from "@/components/GalaxyBackground"
import { CommonHeaderProperties } from "@/contexts/AuthContext"

const registerSchema = object({
  username: string()
    .required("Required")
    .trim()
    .min(3, "Must be at least 3 characters")
    .max(15, "Must be less than 15 characters")
    .matches(
      /^[0-9A-Za-zÀ-ÖØ-öø-ÿ_-]+$/,
      "Cannot contain special characters or spaces"
    ),
  email: string().required("Required").email("Invalid email"),
  password: string()
    .required("Required")
    .min(8, "Must be at least 8 characters")
    .max(40, "Must be less than 40 characters")
    .matches(
      /\d/,
      "Must contain at least 1 upper case, 1 lower case and one number"
    )
    .matches(
      /[A-ZÀ-Ö]/,
      "Must contain at least 1 upper case, 1 lower case and one number"
    )
    .matches(
      /[a-zØ-öø-ÿ]/,
      "Must contain at least 1 upper case, 1 lower case and one number"
    ),
  confirmPassword: string()
    .required("Required")
    .oneOf([ref("password")], "Passwords must match"),
})
const Register = () => {
  const [submitting, setSubmitting] = useState(false)
  const { setUser } = useAuth()
  const router = useRouter()

  return (
    <GalaxyBackground>
      <div className="fadeUp flex flex-col items-center justify-center space-y-6 rounded-lg bg-neutral-900/[.85] px-8 pt-8 pb-2 text-white shadow-md">
        <Head>
          <title>Sign up - Touitteur</title>
        </Head>
        <Image
          src="/twouitteur.svg"
          width={50}
          height={50}
          alt="twouitteur logo"
        />
        <h2 className="text-3xl font-semibold">Sign-up</h2>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={async (values, { setErrors }: { setErrors: any }) => {
            setSubmitting(true)
            api
              .post("auth/register", values)
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
                router.push("/")
              })
              .catch((err) => {
                if (
                  err.response.data.errors &&
                  err.response.data.errors.length > 1
                ) {
                  setErrors({
                    email: "This email is already used",
                    username: "This username is already used",
                  })
                } else if (err.response.data.errors[0].includes("email")) {
                  setErrors({ email: "This email is already used" })
                } else if (err.response.data.errors[0].includes("username")) {
                  setErrors({ username: "This username is already used" })
                } else {
                  setErrors({ server: true })
                }

                setSubmitting(false)
              })
          }}
          validationSchema={registerSchema}
        >
          {({
            isValid,
            dirty,
            errors,
          }: {
            isValid: boolean
            dirty: boolean
            errors: any
          }) => (
            <Form className="space-y-8 divide-y divide-gray-700">
              <div className="flex flex-col text-black">
                <InputForm placeholder="Username" name="username" type="text" />
                <InputForm placeholder="Email" name="email" type="text" />
                <InputForm
                  placeholder="Password"
                  name="password"
                  type="password"
                />
                <InputForm
                  placeholder="ConfirmPassword"
                  name="confirmPassword"
                  type="password"
                />
              </div>
              {errors.server && (
                <div className="space-between bounce ml-1 -mt-1 flex w-48 items-center xl:w-72">
                  <p aria-live="polite" className="text-sm text-orange-500">
                    Something went wrong, please retry later
                  </p>
                </div>
              )}
              <div className="flex flex-col items-center space-y-3 py-8 text-white">
                <button
                  className={`bg-twitter block h-[52px] w-52 rounded-full text-lg font-bold shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-[#1a8cd8] disabled:scale-100 disabled:bg-neutral-500`}
                  type="submit"
                  disabled={!isValid || !dirty || submitting}
                >
                  {submitting ? (
                    <span>
                      Sending ... <Loading color="white" small />
                    </span>
                  ) : (
                    "Sign-up"
                  )}
                </button>
                <div className="text-l">You have an account?</div>
                <Link href="/login">
                  <a>
                    <button className="block h-[52px] w-48 rounded-full bg-white text-lg font-bold text-black shadow-md transition duration-200 ease-out hover:scale-95 hover:bg-slate-300">
                      Sign-in
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

export default Register
