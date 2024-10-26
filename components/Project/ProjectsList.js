import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowCircleRight2, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import projects from "@/json/projects.json"

function ProjectsList() {
    const [currentPage, setCurrentPage] = useState(0); 
    const projectsPerPage = 3;
    const totalPages = Math.ceil(projects.length / projectsPerPage);
  
    const getCurrentProjects = () => {
      const start = currentPage * projectsPerPage;
      return projects.slice(start, start + projectsPerPage);
    };
  
    const handleNext = () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    };
  
    return (
      <div className="container mx-auto px-4 sm:px-4 lg:px-0">
        {getCurrentProjects().map((project, index) => (
          <div key={project.id} className="pt-10 border-b border-gray-200 last:border-0 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
              <div className="lg:w-1/2 lg:pr-36 order-1 lg:order-1">
                <div className="relative w-full h-[250px] lg:h-[360px]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              </div>
  
              <div className="lg:w-1/2 mt-6 lg:mt-0 text-left lg:text-left flex flex-col lg:justify-center lg:h-[360px] order-2 lg:order-2">
                <h1 className="text-3xl font-bold mb-4">
                  {project.title}
                </h1>
                <p className="mb-6">
                  {project.description}
                </p>
                <Link
                  href={"#"}
                  className="bg-brandGreen hover:bg-brandTextGreen text-white py-2 px-6 rounded-full inline-flex items-center w-fit text-sm"
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
          </div>
        ))}
  
        {/* Navigation Controls */}
        <div className="flex justify-between items-center py-8">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className={`flex items-center space-x-2 ${
              currentPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-brandGreen hover:text-brandTextGreen'
            }`}
          >
            <ArrowLeft2 size="24" variant="Bold" />
            <span>Previous</span>
          </button>
  
          {currentPage === totalPages - 1 ? (
            <div className="text-gray-500 text-center">
              No more projects to show
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 text-brandGreen hover:text-brandTextGreen"
            >
              <span>Next</span>
              <ArrowRight2 size="24" variant="Bold" />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default ProjectsList;