import React, { useRef, useEffect } from "react";
import Image from "next/image";

function Brands() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (scroll) {
      const scrollWidth = scroll.scrollWidth;
      const clientWidth = scroll.clientWidth;

      if (scrollWidth > clientWidth) {
        const scrollAnimation = () => {
          if (scroll.scrollLeft >= scrollWidth - clientWidth) {
            scroll.scrollLeft = 0;
          } else {
            scroll.scrollLeft += 1;
          }
        };

        const intervalId = setInterval(scrollAnimation, 50);

        return () => clearInterval(intervalId);
      }
    }
  }, []);

  // Example array of logo sources - replace with your actual logo sources
  const logos = [
    "/assets/un-logo 1.svg",
    "/assets/111 1.svg",
    "/assets/1.svg",
    "/assets/12.svg",
  ];

  // Text constant for trusted companies
  const trustedByText = "We are trusted by 50+ businesses & 1000+ individuals";

  return (
    <section className="bg-brandFadedGreen rounded-lg mt-4 hidden sm:block">
      <div className="px-4 py-6 md:p-7 lg:px-16 lg:py-5 bg-brandFadedGreen rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6"></div>

        {/* Adjust the text with font weight */}
        <p className="text-lg font-alton font-normal mb-4">
          We are trusted by
          <span className="font-sans"> 50+ </span>
          businesses &<span className="font-sans"> 1000+ </span>
          individuals
        </p>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide mb-8 hide-scrollbar"
        >
          {logos.map((logo, index) => (
            <div key={index} className="flex-shrink-0 mr-4">
              <Image
                src={logo}
                alt={`Trusted company logo ${index + 1}`}
                width={114.85}
                height={96}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-between">
          <div className="relative mb-4 lg:mb-0 lg:mr-4">
            <Image
              src="/assets/brand-card1.svg"
              alt="Card 1"
              width={480}
              height={608}
            />

            {/* Text positioned at the bottom of the first image */}
            <div className="absolute bottom-10  text-white p-4 w-80 text-left font-alton font-normal">
              With the Ghana Government and the United Nations we are committed
              to addressing the plastic pollution menace by providing
              cost-effective solutions by transforming plastic waste into
              reusable everyday essentials.
            </div>
          </div>
          <div>
            <Image
              src="/assets/brand-card2.svg"
              alt="Card 2"
              width={776}
              height={608}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brands;
