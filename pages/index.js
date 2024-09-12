import Blog from '@/components/Home/Blog'
import Brands from '@/components/Home/Brands'
import Core from '@/components/Home/Core'
import Hero from '@/components/Home/Hero'
import Quests from '@/components/Home/Quests'
import Services from '@/components/Home/Services'
import React from 'react'

function home() {
  return (
    <>
        <Hero/>
        <Services/>
        <Quests/>
        <Core/>
        <Brands/>
        <Blog/>
    </>

  )
}

export default home