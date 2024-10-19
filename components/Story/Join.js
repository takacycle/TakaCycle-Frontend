import React from 'react'
import Image from 'next/image';
import Link from "next/link";
import { ArrowCircleRight2 } from "iconsax-react";

function Join() {
    return (
        <div className='pt-10'>
        <div className="bg-brandFadedGreen rounded-lg p-12 container mx-auto px-4 flex flex-col lg:flex-row lg:items-center lg:space-x-8">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left flex flex-col lg:justify-center px-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-green-700 mb-4">
              Join the TakaCycle Community
            </h2>
            <p className="mb-4 text-gray-700 ">
              Our WhatsApp community of fellow change makers and earth lovers with a
              united passion of saving the planet and keeping it safe for future
              generations. It’s completely free and open to new members.
            </p>
            <Link href={'#'} className="bg-brandGreen hover:bg-brandTextGreen text-white py-2 px-6 rounded-full inline-flex items-center w-fit text-sm">
            Join our community
            <ArrowCircleRight2
              size="32"
              className="text-white ml-3"
              variant="Bold"
            />
            </Link>
          </div>
    
          {/* WhatsApp Image (Hidden on small screens) */}
          <div className="hidden lg:flex lg:w-1/2 lg:justify-end lg:pr-20">
          <div className="relative w-[150px] h-[150px] mx-auto lg:mx-0">
              <Image
                src="/assets/whatsapp.svg" 
                alt="WhatsApp Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
        </div>
      );
}

export default Join