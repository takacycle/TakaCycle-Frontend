import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore"
import { firestore } from "@/firebase/firebase";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";

export default function BlogView() {
  const router = useRouter();
  const { id } = router.query;

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch when id is available (after hydration)
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  // Function to fetch a single blog by ID
  const fetchBlog = async (blogId) => {
    setIsLoading(true);
    try {
      const docRef = doc(firestore, "blogs", blogId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBlog({
          id: docSnap.id,
          ...docSnap.data()
        });
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle social sharing
  const handleShare = (platform) => {
    // Get current URL
    const url = window.location.href;
    const title = blog?.sections?.[0]?.title || blog?.slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "TakacycleInnovations Blog";

    let shareUrl;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Spinner animation */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-green-700 font-semibold text-lg">
          Loading...
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p className="text-red-500">{error}</p>
      <Link href="/blog" className="mt-4 inline-block text-brandGreen hover:underline">
        Return to blogs
      </Link>
    </div>
  );

  if (!blog) return null;

  // Function to render rich text content from processedContent
  const renderProcessedContent = (processedContent) => {
    if (!processedContent || !processedContent.processed) {
      return <p dangerouslySetInnerHTML={{ __html: processedContent?.raw || "" }} />;
    }

    return (
      <>
        {processedContent.processed.map((item, index) => {
          switch (item.type) {
            case "text":
              return <span key={index}>{item.content}</span>;
            case "link":
              return (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brandGreen hover:underline"
                >
                  {item.text}
                </a>
              );
            default:
              return null;
          }
        })}
      </>
    );
  };

  // Function to render content by type
  const renderContent = (content) => {
    switch (content.type) {
      case "paragraph":
        // Check if there's processed content
        if (content.processedContent && content.processedContent.processed) {
          return <p className="mb-4">{renderProcessedContent(content.processedContent)}</p>;
        }
        return <p className="mb-4" dangerouslySetInnerHTML={{ __html: content.value }} />;

      case "image":
        return (
          <div className="my-6">
            <div className="relative w-full h-[300px]">
              <Image
                src={content.value}
                alt={content.title || "Blog image"}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
            {content.title && <p className="text-center text-sm text-gray-600 mt-2">{content.title}</p>}
          </div>
        );

      case "video":
        return (
          <div className="my-6">
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="relative pt-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={content.value}
                  title={content.title || "Video content"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            {content.title && <p className="text-center text-sm text-gray-600 mt-2">{content.title}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 mt-5">
            <div className="mb-6">
        <Link href="/portal" className="flex items-center text-brandGreen hover:underline">
          <ArrowLeft2 size={20} className="mr-2" />
          Back to Portal
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Featured image */}
        {blog.imageUrl && (
          <div className="relative w-full h-[250px] mb-8">
            <Image
              src={blog.imageUrl}
              alt={blog.slug || "Featured image"}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        )}

        {/* Display main title - use the first section's title or fallback to slug */}
        <h1 className="text-3xl font-bold text-center mb-8">
          {blog.sections && blog.sections[0]?.title ?
            blog.sections[0].title :
            blog.slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>

        {/* Author and date info */}
        <div className="flex justify-between items-center mb-8 text-gray-600">
          <p>{blog.publishedBy ? `By ${blog.publishedBy}` : ""}</p>
          <p>{blog.createdAt ? (
            typeof blog.createdAt === 'object' && blog.createdAt.toDate
              ? blog.createdAt.toDate().toLocaleDateString()
              : typeof blog.createdAt === 'string'
                ? new Date(blog.createdAt.replace(' at ', 'T').replace(' UTC', 'Z')).toLocaleDateString()
                : new Date(blog.createdAt).toLocaleDateString()
          ) : ""}</p>
        </div>

        {/* Blog content sections */}
        <div className="prose max-w-none">
          {blog.sections && blog.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-10">
              {/* Display section titles (except for the first one which is the main title) */}
              {section.title && sectionIndex > 0 && (
                <h2 className="text-lg font-bold text-left mb-4">{section.title}</h2>
              )}

              {/* Render section content */}
              {section.content && section.content.map((contentItem, contentIndex) => (
                <div key={contentIndex}>
                  {renderContent(contentItem)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Tags */}
        {blog.tags && (
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {blog.tags.split(',').map((tag, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Share Buttons */}
        <div className="flex items-start justify-start mt-12 space-x-4">
          <button
            onClick={() => handleShare('twitter')}
            className="bg-black text-white text-sm px-4 py-2 rounded-md w-36 h-10"
            aria-label="Share on Twitter"
          >
            Tweet
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md w-36 h-10"
            aria-label="Share on Facebook"
          >
            Facebook
          </button>

          <button
            onClick={() => handleShare('whatsapp')}
            className="bg-green-400 text-white px-4 text-sm py-2 rounded-md w-36 h-10"
            aria-label="Share on LinkedIn"
          >
            Whatsapp
          </button>
        </div>
      </div>
    </div>
  );
}