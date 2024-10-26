import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft2, ArrowRight2, ArrowCircleRight2 } from "iconsax-react";
import projects from "@/json/projects.json";

function ProjectsList() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollWidth, setMaxScrollWidth] = useState(0);
  const scrollContainer = useRef(null);
  const projectsPerPage = 3;

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

  return (
    <div className="container mx-auto px-4 sm:px-4 lg:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"></h2>
        <div className="flex items-center space-x-2">
          {scrollPosition > 0 && (
            <button
              className="bg-gray-200 rounded-full p-2"
              onClick={() => handleScroll(-1)}
            >
              <ArrowLeft2 size={24} />
            </button>
          )}
          {scrollPosition < maxScrollWidth && (
            <button
              className="bg-gray-200 rounded-full p-2"
              onClick={() => handleScroll(1)}
            >
              <ArrowRight2 size={24} />
            </button>
          )}
        </div>
      </div>
      <div
        ref={scrollContainer}
        className="flex overflow-x-auto space-x-6 scroll-smooth hide-scrollbar"
      >
        {projects.slice(0, projectsPerPage * 3).map((project) => (
          <div
            key={project.id}
            className="flex-shrink-0 w-[300px] sm:w-[400px] rounded-lg p-4 mb-4 bg-white"
          >
            <div className="relative w-full h-[250px]">
              <Image
                src={project.image}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="mt-4">
              <span
                className={`mb-3 ${
                  project.status === "completed" ? "bg-green-600" : "bg-red-600"
                } px-5 py-1 text-white rounded-full`}
              >
                {project.status}
              </span>
              <h3 className="text-xl font-bold mt-2">{project.title}</h3>
              <p className="line-clamp-5 mt-2">{project.description}</p>
              <Link
                href={"#"}
                className="mt-3 bg-brandGreen hover:bg-brandTextGreen text-white py-2 px-6 rounded-full inline-flex items-center w-fit text-sm"
              >
                Learn more
                <ArrowCircleRight2
                  size="32"
                  className="text-white ml-3"
                  variant="Bold"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsList;
