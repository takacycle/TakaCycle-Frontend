import React from 'react'
import Head from "next/head";
import Footer from "@/components/Footer";
import BlogHeader from '@/components/Blog/BlogHeader';
import BlogList from '@/components/Blog/BlogList';
import Newsletter from '@/components/Home/NewsLetter';

function Blog() {
  return (
    <>
      <Head>
        <title>TakaCycle | Our Project</title>
      </Head>
      <BlogHeader />
      <BlogList />
      <Newsletter />
      <Footer />
    </>

  )
}

export default Blog