import React from "react";

function ProjectVideo() {
  return (
    <div className="container mx-auto px-4 sm:px-4 lg:px-0 py-5 pb-5">
      {/* Heading */}
      <h2 className="text-base sm:text-base lg:text-2xl font-bold text-center mb-8">
        See what we&apos;ve been up to this year
      </h2>

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/7hEYtozmb5o"
            title="Our Projects Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ProjectVideo;
