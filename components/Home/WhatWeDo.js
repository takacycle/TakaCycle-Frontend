import { ArrowRight, ArrowLeft } from "iconsax-react";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

function WhatWeDo() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScrollWidth, setMaxScrollWidth] = useState(0);
    const scrollContainer = useRef(null);
  
    useEffect(() => {
      const updateMaxScrollWidth = () => {
        if (scrollContainer.current) {
          setMaxScrollWidth(
            scrollContainer.current.scrollWidth -
              scrollContainer.current.clientWidth
          );
        }
      };
  
      updateMaxScrollWidth();
      window.addEventListener("resize", updateMaxScrollWidth);
  
      return () => window.removeEventListener("resize", updateMaxScrollWidth);
    }, []);
  
    const handleScroll = (direction) => {
      if (scrollContainer.current) {
        const scrollAmount = scrollContainer.current.clientWidth;
        const newScrollPosition = scrollPosition + direction * scrollAmount;
  
        scrollContainer.current.scrollTo({
          left: newScrollPosition,
          behavior: "smooth",
        });
  
        setScrollPosition(
          Math.max(0, Math.min(newScrollPosition, maxScrollWidth))
        );
      }
    };
  
    const services = [
      {
        icon: "/assets/bio-energy.svg",
        title: "Waste Collection & Recycling",
        description:
          "Developing and implementing cutting-edge waste collection and recycling systems to minimize waste sent to landfills and maximize the reuse of materials.",
      },
      {
        icon: "/assets/wind-power-01.svg",
        title: "Materials Recovery & Processing",
        description:
          "Developing and implementing cutting-edge waste collection and recycling systems to minimize waste sent to landfills and maximize the reuse of materials.",
      },
      {
        icon: "/assets/falling-star.svg",
        title: "Environmental Education & Community Engagement",
        description:
          "Developing and implementing cutting-edge waste collection and recycling systems to minimize waste sent to landfills and maximize the reuse of materials.",
      },
      {
        icon: "/assets/save-energy-02.svg",
        title: "Sustainable Waste Management Solutions",
        description:
          "Developing and implementing cutting-edge waste collection and recycling systems to minimize waste sent to landfills and maximize the reuse of materials.",
      },
    ];
    return (
        <section className="bg-white pb-5 mt-4">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="px-5 text-2xl sm:text-3xl font-bold text-center sm:text-left  sm:mb-0">
                What We Do
              </h2>
              <div className="hidden sm:flex items-center space-x-2">
                {scrollPosition > 0 && (
                  <button
                    className="bg-brandFadedGreen rounded-full p-2"
                    onClick={() => handleScroll(-1)}
                  >
                    <ArrowLeft size={24} />
                  </button>
                )}
                {scrollPosition < maxScrollWidth && (
                  <button
                    className="bg-brandFadedGreen rounded-full p-2"
                    onClick={() => handleScroll(1)}
                  >
                    <ArrowRight size={24} />
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 rounded-lg">
              <div
                ref={scrollContainer}
                className="sm:flex sm:overflow-x-auto sm:space-x-6 sm:scroll-smooth hide-scrollbar sm:pb-0"
              >
                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 h-[252px] sm:h-[240px] w-full sm:w-[400px] rounded-lg bg-white  p-4 mb-4 sm:mb-0 border border-brandTextGreen hover:bg-brandFadedGreen cursor-pointer`}
                  >
                    <div className="text-left text-black">
                      <Image
                        src={service.icon}
                        height={40}
                        width={40}
                        alt="icon"
                        className="mb-2"
                      />
                      <h3 className="text-lg sm:text-xl font-bold font-alton mb-2">
                        {service.title}
                      </h3>
                      <p className=" text-sm sm:text-base">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
}

export default WhatWeDo;
