import React from "react";
import Image from "next/image";
import { ArrowCircleRight2 } from "iconsax-react";

function Blog() {
  const blogPosts = [
    {
      title: "The Dangers of Plastic Waste",
      subtitle: "Learn all about the damage of plastic in the ecosystem",
      image: "/assets/blog1.svg",
    },
    {
      title: "Sustainable Living Tips",
      subtitle: "Easy ways to reduce your environmental impact",
      image: "/assets/blog2.svg",
    },
    {
      title: "Climate Change: The Facts",
      subtitle: "Understanding the science behind global warming",
      image: "/assets/blog3.svg",
    },
  ];

  return (
    <section className="bg-white rounded-lg mt-4">
      <div className="px-4 py-6 md:p-7 lg:px-16 lg:py-5 bg-white rounded-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start lg:space-x-8 relative">
          {/* Left Content */}
          <div className="rounded-lg p-6 flex flex-col justify-between lg:w-[432px] lg:h-[254px]">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-left">
                Get smarter about the environment 💡
              </h2>
              <p className="mb-4 text-left">
                The latest news, insights, reports and everything you need to
                know about the environment
              </p>
            </div>

            {/* Button for large screens (hidden on small screens) */}
            <div className="mt-6 flex justify-center lg:justify-start">
              <button className="bg-brandLightGreen text-white px-6 py-2 rounded-full items-center justify-center hidden lg:flex">
              Visit our blog
              <ArrowCircleRight2 size="32" className="text-white ml-3" variant="Bold"/>
          </button>
            </div>
          </div>

          {/* Vertical Divider centered on large screens */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden lg:block transform -translate-x-1/2"></div>

          {/* Blog Post Cards */}
          <div className="rounded-lg p-6 relative lg:w-[343px] lg:h-[384px] overflow-hidden flex flex-col justify-center">
            <div className="space-y-4">
              {blogPosts.map((post, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={96}
                    height={96}
                    className="rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold mb-3 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {post.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button for small screens (hidden on large screens) */}
        <div className="mt-6 flex justify-center lg:hidden">
          <button className="bg-brandLightGreen text-white px-6 py-2 rounded-full flex items-center justify-center">
            Visit our blog
            <ArrowCircleRight2 size="32" className="text-white ml-3" variant="Bold"/>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Blog;
