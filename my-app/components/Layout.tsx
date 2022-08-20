import { NextPage } from "next";

import Head from 'next/head'
import { ReactNode } from "react";
import ThemeSwitch from "./ThemeSwitch";

interface layoutProps {
  children: ReactNode
}

const Layout: NextPage<layoutProps> = ({ children }) => {
  return (
    <main
      className="
      flex flex-col

      bg-zinc-300
      text-zinc-700
      dark:bg-zinc-900 
      dark:text-zinc-400
      min-h-screen min-w-full"
    >
      <Head>
        <title>CryptoDev Decentralized Exchange</title>
        <meta name="description" content="CryptoDev Decentralized Exchange" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section
        className="
        min-w-full flex justify-end items-center 
        p-4
        "
      >
        <ThemeSwitch />
      </section
      >
      <section
        className=' 
        grow  min-w-full
        flex flex-col items-center justify-center'
      >
        {children}
      </section>
    </main>
  )
}


export default Layout
