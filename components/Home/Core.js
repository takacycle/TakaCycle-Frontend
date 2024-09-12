import Image from "next/image";
import React from "react";

function Core() {
  const coreValues = [
    { title: "Sustainability", subtitle: "We prioritize the well-being of people and the planet, striving for a positive environmental and social impact." },
    { title: "Passion", subtitle: "We create a sense of purpose and motivation as a community, energized by our work and values." },
    { title: "Innovation", subtitle: "We foster a culture of creativity, celebrating new ideas and staying curious to explore new possibilities." },
    { title: "Commitment", subtitle: "We are dedicated to our mission, committed to changing the narrative about plastic waste management." },
    { title: "Excellence", subtitle: "We strive for the highest quality of work, embracing quality over quantity and leadership by example" },
    { title: "We are SPICED to make the world a better place" }
  ];

  return (
    <section className="bg-white mt-4">
      <div className="px-4 py-6 md:p-7 lg:px-16 lg:py-5">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left sm:mb-0">
            Our Core Values
          </h2>
        </div>
        <div className="mt-10 mx-auto h-[800px] md:h-[560px] relative">
          <Image
            src="/assets/core-bg.svg"
            alt="Recycling Carousel"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coreValues.map((value, index) => (
                <div 
                  key={index} 
                  className={`w-72 bg-opacity-90 p-4 rounded-lg ${index === 5 ? 'hidden md:block' : ''}`}
                >
                  {index === 5 ? (
                    <h3 className="font-alton font-bold mb-2 text-center md:text-left text-xl text-white">
                      We are <span className="text-brandLightGreen">SPICED</span> to make the world a better place
                    </h3>
                  ) : (
                    <h3 className="text-white font-alton font-bold mb-2 text-center md:text-left text-xl">{value.title}</h3>
                  )}
                  {value.subtitle && <p className="text-white text-sm text-center md:text-left">{value.subtitle}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Core;