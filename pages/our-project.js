import React from "react";
import Head from "next/head";
import Footer from "@/components/Footer";
import ProjectHeader from "@/components/Project/ProjectHeader";
import ProjectsList from "@/components/Project/ProjectsList";
import ProjectVideo from "@/components/Project/ProjectVideo";

function Project() {
  return (
    <>
      <Head>
        <title>TakaCycle | Our Project</title>
      </Head>
      <div>
        <ProjectHeader />
        <ProjectsList/>
        <ProjectVideo/>

        <Footer />
      </div>
    </>
  );
}

export default Project;
