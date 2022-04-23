import Layout from "@/components/Layout"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

const AppContentWrapper = ({
  Component,
  pageProps,
  ...othersProps
}: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} {...othersProps} />
    </Layout>
  )
}
const App = (props: AppProps) => {
  return <AppContentWrapper {...props} />
}

export default App
