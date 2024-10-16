import React from "react";
import { ArrowCircleRight2 } from "iconsax-react";
function Newsletter() {
  return (
    <section className="bg-green-100 p-5 lg:p-20 rounded-lg">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div>
        <div className="mb-6 lg:mb-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
            Monthly Newsletter
          </h2>
          <p className="text-gray-700 mt-2 text-sm sm:text-base lg:text-lg">
            Sign up for weekly newsletter for news, stories and updates from our projects.
          </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="w-full flex space-x-4">
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-4 text-gray-700 placeholder-gray-500 bg-white focus:outline-none w-full rounded-l-full"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-4 text-gray-700 placeholder-gray-500 bg-white focus:outline-none w-full rounded-r-full"
              />
            </div>
          </div>
   
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-4 text-gray-700 placeholder-gray-500 bg-white focus:outline-none w-full rounded-full pr-16" // Added right padding for the button
              />
              <button className="absolute right-0 bottom-0 top-0 text-white px-5 py-5 rounded-full flex items-center justify-center">
                <ArrowCircleRight2
                  size="32"
                  className="text-brandTextGreen ml-3"
                  variant="Bold"
                />
              </button>
            </div>
          </div>
        </div>
    </section>
  );
}

export default Newsletter;
