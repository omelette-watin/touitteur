import api from "@/api/api"
import { AuthContextType } from "@/types/auth"
import { useRouter } from "next/router"
import { createContext, ReactNode, useState, useEffect } from "react"

interface CommonHeaderProperties {
  "x-access-token": string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<Object | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const token: string | null = localStorage.getItem("token")

      if (token) {
        ;(
          api.defaults.headers! as unknown as Record<
            string,
            CommonHeaderProperties
          >
        ).common["x-access-token"] = token

        try {
          const { data } = await api.get("/user/me")

          if (data) {
            setUser(data)
          }
        } catch (e) {
          localStorage.removeItem("token")
        }
      }

      setLoading(false)
    })()
  }, [router])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
