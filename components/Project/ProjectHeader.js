import React from "react";
import Image from "next/image";

function ProjectHeader() {
  return (
    <div className="container mx-auto px-4">
      <div className="relative">
        <Image
          src="/assets/projectheader.svg"
          alt="Project Header"
          width={1296}
          height={314}
          className="w-full"
        />
        <p className="mt-4 text-left sm:text-left lg:text-left ">
          At TakaCycle, our mission transcends mere environmental advocacy; we
          are on the ground, making tangible impacts through diverse projects
          aimed at promoting sustainability and combating climate change. Each
          project is a step forward in our journey towards a greener, cleaner
          planet.
        </p>
        <p className="mt-6 text-left sm:text-left lg:text-left ">
          Explore the innovative and transformative projects we&apos;re working
          on:
        </p>
      </div>
    </div>
  );
}

export default ProjectHeader;
