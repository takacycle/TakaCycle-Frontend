import React from "react";
import Image from "next/image";

function StoryHeader() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Text Content */}
        <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left flex flex-col lg:justify-center lg:h-[360px]">
          <h1 className="text-3xl font-bold mb-4">The TakaCycle Story</h1>

          {/* Image for small screens */}
          <div className="lg:hidden mb-4">
            <div className="relative w-full h-[250px]">
              <Image
                src="/assets/storyheaderbg.svg"
                alt="TakaCycle Worker"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>

          <p className="mb-6">
            TakaCycle Innovations was founded as a solution to the plastic
            menace of Ghana and Africa at large. Inspired by the United
            Nation&apos;s Sustainable Development Goals, we saw an opportunity
            to help curb this problem while making revenue in the process.
          </p>
          <div className="flex flex-col items-center sm:flex-row sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <div className="relative w-[180px] h-[180px] sm:w-[150px] sm:h-[150px]">
              <Image
                src="/assets/SDG3.svg"
                alt="Sustainable Cities"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-[180px] h-[180px] sm:w-[150px] sm:h-[150px]">
              <Image
                src="/assets/SDG2.svg"
                alt="Climate Action"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="relative w-[180px] h-[180px] sm:w-[150px] sm:h-[150px]">
              <Image
                src="/assets/SDG1.svg"
                alt="Life on Land"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
        {/* Image for large screens */}
        <div className="hidden lg:block lg:w-1/2">
          <div className="relative w-full h-[380px]">
            <Image
              src="/assets/storyheaderbg.svg"
              alt="TakaCycle Worker"
              layout="fill"
              objectFit="contain "
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryHeader;
