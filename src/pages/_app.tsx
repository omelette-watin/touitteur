import Layout from "@/components/Layout"
import LoadingPage from "@/components/LoadingPage"
import AuthContextProvider from "@/contexts/AuthContext"
import { ModalContextProvider } from "@/contexts/ModalContext"
import useAuth from "@/hooks/useAuth"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

const AppContentWrapper = ({
  Component,
  pageProps,
  ...othersProps
}: AppProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingPage />
  }

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
