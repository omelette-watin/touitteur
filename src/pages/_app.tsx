import Layout from "@/components/Layout"
import { ModalContextProvider } from "@/contexts/ModalContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

const AppContentWrapper = ({
  Component,
  pageProps,
  ...othersProps
}: AppProps) => {
  return (
    <ModalContextProvider>
      <Layout title={pageProps.title}>
        <Component {...pageProps} {...othersProps} />
      </Layout>
    </ModalContextProvider>
  )
}
const App = (props: AppProps) => {
  return <AppContentWrapper {...props} />
}

export default App
