import React from "react";
import Image from "next/image";

function TeamMember() {
  const teamMembers = [
    {
      name: "Emmanuel Awimbila Adindaa",
      position: "CEO",
      image: "/assets/team-member1.svg",
    },
    {
      name: "Daniel Henaku Ofori",
      position: "Head, Waste Management",
      image: "/assets/team-member2.svg",
    },
    {
      name: "Olivia Kwartemaa",
      position: "Head, Operations & Logistics",
      image: "/assets/team-member3.svg",
    },
    {
      name: "Nana Sam Yeboah",
      position: "Head, Technology & Innovation",
      image: "/assets/team-member4.svg",
    },
    {
      name: "Catherine Antwi Boasiako",
      position: "Head, Community Engagement and Education",
      image: "/assets/team-member5.svg",
    },
    {
      name: "Jason S.K. Ahiable",
      position: "Head, Brand Management & Marketing",
      image: "/assets/team-member6.svg",
    },
    {
      name: "⁠Suzetta N. N. Brocke",
      position: "Head, Business Development",
      image: "/assets/team-member7.svg",
    },
    {
      name: "Ruth Anamaa Adindaa",
      position: "Head, Finance",
      image: "/assets/team-member8.svg",
    },
  ];

  const TeamMember = ({ name, position, image }) => (
    <div className="flex flex-col items-center">
      <div className="w-48 h-60 sm:w-56 sm:h-72 lg:w-64 lg:h-80 relative">
        <Image src={image} alt={name} layout="fill" objectFit="cover" />
      </div>
      <div className="space-y-1 mt-2 text-left w-48  sm:w-56  lg:w-64 ">
        <h3 className="text-base font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{position}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <div className="relative">
        <h2 className="mt-5 font-bold text-2xl mb-10 text-center sm:text-center lg:text-left">
          Board Members
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </div>
  );
}

export default TeamMember;
