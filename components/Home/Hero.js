import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/assets/Slider1.svg",
    "/assets/Slider2.svg",
    "/assets/Slider3.svg",
    "/assets/Slider4.svg",
  ];

  // Automatically change the image every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5000ms or 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [images.length]);

  return (
    <>
      <section className="bg-white">
        <div className="md:p-7 lg:px-16 lg:py-5">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-alton font-bold text-5xl text-gray-900">
              <span className="text-brandLightGreen">Pioneering Innovative</span> <br />
              <span className="text-brandLightBlue mt-4">Recycling Solutions</span>
            </h2>
          </div>

          <div className="mx-auto max-w-2xl text-center mt-6">
            <p className="text-black text-lg">
              <span>Join the movement that’s redefining waste management across the
              nation </span> <br/>
              <span>and help us close the loop on waste and turn challenges into
              opportunities.</span>
            </p>
          </div>

          {/* Image Carousel (Visible on larger screens) */}
          <div className="mt-10 mx-auto h-[314px] relative hidden md:block">
            <Image
              src={images[currentImage]}
              alt="Recycling Carousel"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Support Us Button (Visible on mobile screens) */}
          <div className="mt-10 flex justify-center md:hidden">
            <Link
              className="rounded-full bg-brandLightGreen px-5 py-2.5 text-sm font-alton font-normal text-white"
              href="#"
            >
              Support us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
