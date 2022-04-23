import Layout from "@/components/Layout"
import LoadingPage from "@/components/LoadingPage"
import AuthContextProvider from "@/contexts/AuthContext"
import { ModalContextProvider } from "@/contexts/ModalContext"
import useAuth from "@/hooks/useAuth"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"

TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

const AppContentWrapper = ({
  Component,
  pageProps,
  ...othersProps
}: AppProps) => {
  const { user, loading } = useAuth()
  const { needAuth } = pageProps

  if (loading) {
    return <LoadingPage />
  }

  if (!user && needAuth) {
    return <p>Oupsi</p>
  }

  // if (!needAuth) {
  //   return <Component {...pageProps} {...othersProps} />
  // }

  return (
    <ModalContextProvider>
      <Layout title={pageProps.title}>
        <Component {...pageProps} {...othersProps} />
      </Layout>
    </ModalContextProvider>
  )
}
const App = (props: AppProps) => {
  return (
    <AuthContextProvider>
      <AppContentWrapper {...props} />
    </AuthContextProvider>
  )
}

export default App
