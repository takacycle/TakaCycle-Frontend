import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowCircleRight2 } from "iconsax-react";

const blogData = [
  {
    title: "The Dangers of Plastic Waste",
    description: "Learn all about the damage of plastic in the ecosystem",
    image: "assets/blogImage.svg",
    href: "#",
  },
  {
    title: "Saving Our Oceans Waste",
    description: "Discover ways we can preserve marine life",
    image: "/assets/blogImage.svg",
    href: "#",
  },
  {
    title: "Sustainable Energy Sources",
    description: "Explore alternative energy sources for a greener future",
    image: "/assets/blogImage.svg",
    href: "#",
  },
  {
    title: "Deforestation and Its Impact",
    description: "Understand the effects of deforestation on wildlife",
    image: "/assets/blogImage.svg",
    href: "#",
  },
];

function BlogSection() {
  return (
    <section className="bg-white mt-4">
      <div className="px-4">
        {/* Header and description */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-start sm:text-left sm:mb-0">
            Get smarter about the environment 💡
          </h2>
        </div>
        <p className="text-gray-600 text-start mb-8">
          The latest news, insights, reports, and everything you need to know
          about the environment.
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
          {blogData.map((item, index) => (
            <Link key={index} href={item.href} className="block">
              {/* Ensure side-by-side for small screens and vertical for large screens */}
              <div className="flex flex-row lg:flex-col lg:items-center lg:space-y-4 rounded-lg overflow-hidden w-full">
                {/* Image */}
                <div className="relative w-24 h-24 lg:w-full lg:h-40">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                {/* Text content */}
                <div className="py-4 px-4 flex-1 lg:py-0 lg:px-0">
                  <h3 className="font-bold text-base line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-center lg:justify-start lg:items-start">
          <Link
            href="#"
            className="w-fit bg-brandGreen text-white px-5 py-3 text-sm font-alton font-normal rounded-full flex items-center justify-center hover:bg-brandTextGreen"
          >
            Visit our blog
            <ArrowCircleRight2
              size="32"
              className="text-white ml-3"
              variant="Bold"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
