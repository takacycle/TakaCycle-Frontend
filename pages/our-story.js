import React from "react";
import Head from "next/head";
import StoryHeader from "@/components/Story/StoryHeader";
import StoryMission from "@/components/Story/StoryMission";
import StoryVision from "@/components/Story/StoryVision";
import Footer from "@/components/Footer";
import Partners from "@/components/Story/Partners";
import Join from "@/components/Story/Join";

function Story() {
  return (
    <>
      <Head>
        <title>TakaCycle | Our Story</title>
      </Head>
      <div>
        <StoryHeader />
        <StoryMission/>
        <StoryVision/>
        <Partners/>
        <Join/>
        <Footer/>
      </div>
    </>
  );
}

export default Story;
