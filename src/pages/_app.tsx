import Layout from "@/components/Layout"
import LoadingPage from "@/components/LoadingPage"
import AuthContextProvider from "@/contexts/AuthContext"
import { ModalContextProvider } from "@/contexts/ModalContext"
import useAuth from "@/hooks/useAuth"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import { ReplyToContextProvider } from "@/contexts/ReplyToContext"
import { PostedTweetContextProvider } from "@/contexts/PostedTweetsContext"
import ConnectionScreen from "@/components/NoAuthScreen"
import NProgress from "nprogress"
import { useEffect } from "react"
import Router from "next/router"

TimeAgo.setDefaultLocale(en.locale)
TimeAgo.addLocale(en)

NProgress.configure({
  showSpinner: false,
  easing: "ease",
  speed: 500,
})

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
    return <ConnectionScreen />
  }

  if (!needAuth) {
    return <Component {...pageProps} {...othersProps} />
  }

  return (
    <PostedTweetContextProvider>
      <ReplyToContextProvider>
        <ModalContextProvider>
          <Layout title={pageProps.title}>
            <Component {...pageProps} {...othersProps} />
          </Layout>
        </ModalContextProvider>
      </ReplyToContextProvider>
    </PostedTweetContextProvider>
  )
}
const App = (props: AppProps) => {
  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start())
    Router.events.on("routeChangeComplete", () => NProgress.done())
    Router.events.on("routeChangeError", () => NProgress.done())
  }, [])

  return (
    <AuthContextProvider>
      <AppContentWrapper {...props} />
    </AuthContextProvider>
  )
}

export default App
