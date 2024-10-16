import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

function Header() {
  return (
    <div className="pb-5">
      <Head>
        <title>TakaCycle | Home</title>
      </Head>
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:gap-8">
        {/* Left side text content */}
        <div className="flex-1 lg:mr-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-green-700 leading-tight">
            <span className="text-brandTextGreen">Pioneering Innovative</span>{" "}
            Recycling Solutions for Africa
          </h1>
          <p className="mt-4 text-base lg:text-lg text-gray-600">
            <span className="block lg:hidden px-8">
              Join the movement that&apos;s redefining waste management across the
              nation and help us close the loop on waste and turn challenges
              into opportunities.
            </span>
            <span className="hidden lg:block">
              We are redefining waste management across the continent, closing
              the loop on waste and turning challenges into opportunities.
            </span>
          </p>

          <div>
            {/* Button for small screens */}
            <Link
              href="#"
              className=" w-fit mt-6 bg-brandGreen hover:bg-brandTextGreen text-white  px-5 py-4  text-sm font-alton font-normal rounded-full mx-auto lg:hidden block"
            >
              Support us
            </Link>
            {/* Button for large screens */}
            <Link
              href="#"
              className=" w-fit mt-6 bg-brandGreen hover:bg-brandTextGreen text-white px-5 py-4 text-sm font-alton font-normal rounded-full mx-auto lg:mx-0 hidden lg:block"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right side image */}
        <div className="flex-1 mt-8 lg:mt-0 hidden lg:block">
          <div className="relative w-[450px] h-[440px]">
            <Image
              src="/assets/header-Image.svg"
              alt="Recycling Solutions"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
