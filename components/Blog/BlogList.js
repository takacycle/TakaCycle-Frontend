import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowCircleRight2, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import projects from "@/json/projects.json";

function BlogList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScrollWidth, setMaxScrollWidth] = useState(0);
    const projectsPerPage = 6; // 3 per row, 2 rows
    const categoriesRef = useRef(null);

    // Categories
    const categories = ["All", "Waste", "Education"];

    // Filter projects based on search term and category
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Update scroll information for categories
    useEffect(() => {
        const updateMaxScrollWidth = () => {
            if (categoriesRef.current) {
                setMaxScrollWidth(
                    categoriesRef.current.scrollWidth - categoriesRef.current.clientWidth
                );
            }
        };

        updateMaxScrollWidth();
        window.addEventListener("resize", updateMaxScrollWidth);
        return () => window.removeEventListener("resize", updateMaxScrollWidth);
    }, []);

    // Handle category scroll
    const handleCategoryScroll = (direction) => {
        if (categoriesRef.current) {
            const scrollAmount = 200; // Adjust based on your needs
            const newScrollPosition = scrollPosition + direction * scrollAmount;

            categoriesRef.current.scrollTo({
                left: newScrollPosition,
                behavior: "smooth",
            });

            setScrollPosition(
                Math.max(0, Math.min(newScrollPosition, maxScrollWidth))
            );
        }
    };

    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle category selection
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when changing category
        console.log("Selected category:", category); // Console log the category name as requested
    };

    // Reset page if filtered results change dramatically
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [filteredProjects, currentPage, totalPages]);

    return (
        <div className="container mx-auto px-4 sm:px-4 lg:px-0">
            {/* Search bar */}
            <div className="mb-4">
                <div className="relative text-center items-center">
                    <input
                        type="text"
                        placeholder="Search blog title..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mt-4 w-full sm:w-80 lg:w-96 py-3 px-4 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandGreen"
                    />
                </div>
            </div>

            {/* Categories section - improved mobile scrolling */}
            <div className="relative mb-8 overflow-hidden">
                {/* Left scroll button - visible only on larger screens */}
                {scrollPosition > 0 && (
                    <button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hidden sm:block"
                        onClick={() => handleCategoryScroll(-1)}
                    >
                        <ArrowLeft2 size={20} />
                    </button>
                )}

                {/* Categories container with improved mobile scrolling */}
                <div
                    ref={categoriesRef}
                    className="flex overflow-x-auto py-2 px-4 sm:px-8 space-x-3 no-scrollbar"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch' // For smooth scrolling on iOS
                    }}
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm  transition-colors duration-200 flex-shrink-0 ${selectedCategory === category
                                    ? "bg-brandGreen text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Right scroll button - visible only on larger screens */}
                {scrollPosition < maxScrollWidth && (
                    <button
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hidden sm:block"
                        onClick={() => handleCategoryScroll(1)}
                    >
                        <ArrowRight2 size={20} />
                    </button>
                )}
            </div>

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentProjects.map((project) => (
                    <div
                        key={project.id}
                        className="rounded-lg p-4 mb-4 bg-white"
                    >
                        <div className="relative w-full h-[200px] sm:h-[250px]">
                            <Image
                                src={project.image}
                                alt={project.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </div>
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {project.tags && project.tags.split(',').map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-xl font-bold mt-2">{project.title}</h3>
                            <p className="line-clamp-4 sm:line-clamp-5 mt-2 text-sm sm:text-base">{project.description}</p>
                            <Link
                                href={"#"}
                                className="mt-3 bg-brandGreen hover:bg-brandTextGreen text-white py-2 px-4 sm:px-6 rounded-full inline-flex items-center w-fit text-sm"
                            >
                                Read more
                                <ArrowCircleRight2
                                    size={24}
                                    className="text-white ml-2 sm:ml-3"
                                    variant="Bold"
                                />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results message */}
            {filteredProjects.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No projects found matching your search and category.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 mb-8">
                    <nav className="inline-flex flex-wrap rounded-md shadow-sm">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 sm:px-4 py-2 border ${currentPage === number
                                        ? "bg-brandGreen text-white border-brandGreen"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    } ${number === 1 ? "rounded-l-md" : ""
                                    } ${number === totalPages ? "rounded-r-md" : ""
                                    }`}
                            >
                                {number}
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* CSS for hiding scrollbars but keeping scroll functionality */}
            <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
        </div>
    );
}

export default BlogList;