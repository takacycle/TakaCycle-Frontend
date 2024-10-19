import React from "react";
import Image from "next/image";

function Partners() {
  return (
    <div className="container mx-auto px-4 sm:block lg:hidden">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Text Content */}
        <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left flex flex-col lg:justify-center lg:h-[360px]">
          <p className="mb-6">
          Our Trusted Partners
          </p>
          <div className="flex flex-col items-center sm:flex-row sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <div className="relative w-[140px] h-[140px] sm:w-[150px] sm:h-[150px]">
              <Image
                src="/assets/un-logo.svg"
                alt="Sustainable Cities"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-[140px] h-[140px] sm:w-[150px] sm:h-[150px]">
              <Image
                src="/assets/kfc.svg"
                alt="Sustainable Cities"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-[140px] h-[140px] sm:w-[150px] sm:h-[150px]">
              <Image
                src="/assets/zoomlion.svg"
                alt="Climate Action"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-[140px] h-[140px] sm:w-[150px] sm:h-[150px]">
              <Image
               src="/assets/nhis.svg"
                alt="Life on Land"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Partners;
