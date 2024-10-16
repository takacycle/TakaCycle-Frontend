import React from 'react'
import Head from 'next/head'
import Header from '@/components/Home/Header'
import WhatWeDo from '@/components/Home/WhatWeDo'
import OurCoreValues from '@/components/Home/OurCoreValues'
import BlogSection from '@/components/Home/BlogSection'

function Home() {
  return (
    <>
      <Head>
        <title>TakaCycle | Home</title>
      </Head>
      <div>
        <Header/>
        <WhatWeDo/>
        <OurCoreValues/>
        <BlogSection/>
      </div>
    </>
  )
}

export default Home
