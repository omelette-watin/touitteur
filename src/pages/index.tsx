import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home / Touitteur</title>
      </Head>
      <div>HomePage</div>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: "Home",
    },
  }
}
