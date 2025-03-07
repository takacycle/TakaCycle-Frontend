import React from "react";
import Image from "next/image";

function StoryVision() {
  return (
    <div className="container mx-auto pt-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
        {/* Text Content */}
        <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left flex flex-col lg:justify-center lg:h-[360px] order-2 lg:order-2">
          <h1 className="text-3xl font-bold mb-4">Our Vision</h1>

          {/* Image for small screens */}
          <div className="lg:hidden mb-4 order-2">
            <div className="relative w-full h-[250px]">
              <Image
                src="/assets/visionbg.svg"
                alt="TakaCycle Worker"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
          <p className="mb-6">
            To become a global champion in recycling waste materials while
            educating and empowering all stakeholders to thrive in a
            plastic-free future, leaving a blueprint for others to follow.
          </p>
        </div>
        {/* Image for large screens */}
        <div className="hidden lg:block lg:w-1/2 order-1 lg:order-1 pr-36">
          <div className="relative w-full h-[360px]">
            <Image
              src="/assets/visionbg.svg"
              alt="TakaCycle Worker"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryVision;
