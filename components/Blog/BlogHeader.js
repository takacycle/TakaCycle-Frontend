import React from "react";
import Image from "next/image";

function BlogHeader() {
  return (
    <div className="container mx-auto px-4">
      <div className="relative">
        <Image
          src="/assets/blog-header.svg"
          alt="Project Header"
          width={1296}
          height={314}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default BlogHeader;
