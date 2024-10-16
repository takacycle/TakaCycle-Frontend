import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowCircleRight2 } from "iconsax-react";

function DonateSection() {
  return (
    <div className="py-20">
      <section className="relative rounded-lg overflow-hidden">
        <div className="relative w-full h-[250px] sm:h-[500px] lg:h-[300px]">
          <Image
            src="/assets/donateImage.svg"
            alt="Support our cause"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0"
          />
        </div>

        {/* Overlay Text */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-start sm:items-start lg:items-center justify-center text-left lg:text-center p-6">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
            Give to support our cause
          </h2>
          <p className="text-white text-sm  lg:text-lg mt-4 max-w-md lg:max-w-3xl">
            To undertake more projects in saving the Earth, we need support in
            making our vision a reality.
          </p>
          <div className="mt-6">
            <Link
              href="#"
              className="w-fit bg-brandGreen text-white px-5 py-3 text-sm font-alton font-normal rounded-full flex items-center justify-center hover:bg-brandTextGreen"
            >
              <span>Donate now</span>
              <ArrowCircleRight2
                size="32"
                className="text-white ml-3"
                variant="Bold"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DonateSection;
