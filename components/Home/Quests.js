import React from "react";
import Image from "next/image";

function Quests() {
    const quests = [
        {
          icon: "/assets/eco-power.svg",
          title: "Optimizing Waste Management",
          description:
            "Developing and implementing cutting-edge waste collection and recycling systems to minimize waste sent to landfills and maximize the reuse of materials.",
        },
        {
          icon: "/assets/atom-02.svg",
          title: "Innovation and Technology",
          description:
            "Harnessing innovative technologies to revolutionize waste processing and recycling methods, ensuring sustainable, efficient, and scalable solutions.",
        },
        {
          icon: "/assets/briefcase-04.svg",
          title: "Job Creation",
          description:
            "Fostering economic growth by creating employment opportunities in the recycling and waste management sectors, contributing to the local economy's development.",
        }
    ];

    return (
        <section className="bg-brandFadedGreen rounded-lg mt-4">
            <div className="px-4 py-6 md:p-7 lg:px-16 lg:py-5 bg-brandFadedGreen rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left sm:mb-0">
                        Our Core Quests
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    {/* Card 1 - Hidden on mobile */}
                    <div className="hidden lg:block rounded-lg overflow-hidden">
                        <Image
                            src="/assets/quest1.svg" 
                            alt="Card 1" 
                            className="w-full h-96 object-cover rounded-lg"
                            height={384}
                            width={400}
                        />
                    </div>

                    {/* Card 2 - Three sub-cards */}
                    <div className="space-y-4">
                        {quests.map((quest, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                                <Image
                                    src={quest.icon}
                                    height={30}
                                    width={30}
                                    alt="icon"
                                    className="mb-2"
                                />
                                <h3 className="text-xl font-alton font-bold mb-2">{quest.title}</h3>
                                <p className="text-sm sm:text-base font-alton font-normal">{quest.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Card 3 - Responsive height */}
                    <div className="rounded-lg overflow-hidden">
                        <Image
                            src="/assets/quest2.svg" 
                            alt="Card 3" 
                            className="w-full h-[400px] md:h-[550px] lg:h-[710px] object-cover rounded-lg"
                            height={710}
                            width={400}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Quests;