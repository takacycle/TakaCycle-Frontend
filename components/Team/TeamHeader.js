import React from "react";
import Image from "next/image";

function TeamHeader() {

  return (
    <div className="container mx-auto px-4">
      <div className="relative">
        <Image
          src="/assets/teamheader.svg"
          alt="Wind turbines"
          width={1296}
          height={314}
          className="w-full"
        />
        <p className="mt-4 text-center sm:text-center lg:text-left ">
          We are dynamic team of highly motivated individuals with a united
          mission of saving the planet and making the Earth a safe place for us
          and future generations. With diverse backgrounds, we forge together to
          strive for success.
        </p>
      </div>
    </div>
  );
}

export default TeamHeader;
