import React from "react";
import Head from "next/head";
import TeamHeader from "@/components/Team/TeamHeader";
import Footer from "@/components/Footer";
import TeamMember from "@/components/Team/TeamMembers";
import Volunteer from "@/components/Team/Volunteer";

function Team() {
  return (
    <>
      <Head>
        <title>TakaCycle | Our Team</title>
      </Head>
      <div>
        <TeamHeader />
        <TeamMember/>
        <Volunteer/>
        <Footer />
      </div>
    </>
  );
}

export default Team;
