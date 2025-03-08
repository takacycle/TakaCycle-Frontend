import React, { useState, useEffect } from "react";
import Image from "next/image";
import { firestore } from "@/firebase/firebase"; 
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, deleteDoc } from "@firebase/firestore"
import Link from "next/link"; // Import Link from Next.js

export default function BlogCreator() {
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [imageName, setImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageURL] = useState(null);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const [publishing, setPublishing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // New data structure for sections with different content types
  const [sections, setSections] = useState([
    { 
      title: "", 
      content: [
        { type: "paragraph", value: "", processedContent: null }
      ] 
    }
  ]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedIn");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          firstName: parsedUser.firstName || "Unknown",
          lastName: parsedUser.lastName || "User",
        });
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

    // Fetch blog categories on component mount
    useEffect(() => {
      fetchCategories();
    }, []);
  

    // URL detection regex
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+\.[^\s]+)/g;

    // Function to process paragraph text and convert URLs to link objects
    const processParagraphLinks = (text) => {
      if (!text) return { raw: text, processed: null };
      
      // Find all URLs in the text
      const matches = [...text.matchAll(urlRegex)];
      
      if (matches.length === 0) {
        return { raw: text, processed: null };
      }
      
      // Process the text to replace URLs with link objects
      let lastIndex = 0;
      const elements = [];
      
      matches.forEach((match, idx) => {
        const url = match[0];
        const startIndex = match.index;
        
        // Add text before the URL
        if (startIndex > lastIndex) {
          elements.push({ type: 'text', content: text.slice(lastIndex, startIndex) });
        }
        
        // Add the URL as a link object
        // Ensure URL has proper format with http/https
        const formattedUrl = url.startsWith('www.') ? `https://${url}` : url;
        elements.push({ type: 'link', url: formattedUrl, text: url });
        
        lastIndex = startIndex + url.length;
      });
      
      // Add remaining text after the last URL
      if (lastIndex < text.length) {
        elements.push({ type: 'text', content: text.slice(lastIndex) });
      }
      
      return { raw: text, processed: elements };
    };
    // Fetch categories from Firestore
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, "blog_categories"));
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setIsLoading(false);
      }
    };

  // Handle category selection from dropdown
  const handleCategorySelect = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    // Find the selected category and populate form
    const selectedCat = categories.find(cat => cat.id === categoryId);
    if (selectedCat) {
      setCategory(
         selectedCat.name,
      );
    }
  }

  const generateSlug = () => {
    if (!sections[0].title.trim()) {
      setError("Enter a main Title first to generate a slug for the blog.");
      return;
    }
    
    // Generate slug from first title
    const formattedSlug = sections[0].title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  
    setSlug(formattedSlug);
  };

  const handleTagChange = (e) => {
    let input = e.target.value;
    let commaCount = (input.match(/,/g) || []).length;
    if (commaCount < 3) {
      setTags(input);
    }
  };

  const remainingTags = 3 - (tags.match(/,/g) || []).length;


  // Section management functions
  const addSection = () => {
    setSections([...sections, { 
      title: "", 
      content: [{ type: "paragraph", value: "", processedContent: null }] 
    }]);
  };
  const updateSectionTitle = (sectionIndex, newTitle) => {
    const newSections = [...sections];
    newSections[sectionIndex].title = newTitle;
    setSections(newSections);
  };

  const addContentItem = (sectionIndex, contentType) => {
    const newSections = [...sections];
    newSections[sectionIndex].content.push({ 
      type: contentType, 
      value: contentType === "video" ? "" : contentType === "image" ? "" : "",
      processedContent: contentType === "paragraph" ? null : undefined,
    });
    setSections(newSections);
  };

  const updateContentItem = (sectionIndex, contentIndex, newValue) => {
    const newSections = [...sections];
    const contentItem = newSections[sectionIndex].content[contentIndex];
    contentItem.value = newValue;
    
    // Process paragraph links when content is updated
    if (contentItem.type === "paragraph") {
      contentItem.processedContent = processParagraphLinks(newValue);
    }
    
    setSections(newSections);
  };

  const uploadSectionImage = async (sectionIndex, contentIndex) => {
    if (!file || !imageName.trim()) {
      setError("Please select a file and provide a name!");
      return;
    }
  
    setUploading(true);
    setError(null);
  
    try {
      const reader = new FileReader();
  
      const fileDataPromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
  
      const base64String = await fileDataPromise;
      const fileExtension = getFileExtension(file);
  
      const response = await fetch("/api/blog_upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customFileName: imageName.trim(),
          fileData: base64String,
          fileType: file.type,
          fileExtension: fileExtension
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
  
      // Update the section content with the image URL
      const newSections = [...sections];
      newSections[sectionIndex].content[contentIndex].value = result.file.imageUrl; // ✅ Assign uploaded image URL
      setSections(newSections);
  
      // Clean up
      setFile(null);
      setImageName("");
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = null;
  
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setFile(null);
        setPreviewUrl(null);
        e.target.value = null;
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only .jpeg, .jpg, and .png files are allowed");
        setFile(null);
        setPreviewUrl(null);
        e.target.value = null;
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setFile(selectedFile);
      setError(null);

      // Set default image name from file name (without extension)
      const defaultName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setImageName(defaultName);
    }
  };

  const getFileExtension = (file) => {
    const match = file.name.match(/\.[^/.]+$/);
    return match ? match[0] : '';
  };

  const uploadFile = async () => {
    if (!file || !imageName.trim()) {
      setError("Please select a file and provide a name!");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();

      const fileDataPromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      const base64String = await fileDataPromise;
      const fileExtension = getFileExtension(file);

      const response = await fetch("/api/blog_upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customFileName: imageName.trim(),
          fileData: base64String,
          fileType: file.type,
          fileExtension: fileExtension
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadedImage(result.file);
      setImageURL(result.file.imageUrl);

      // Clean up
      setFile(null);
      setImageName("");
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = null;

    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const validateAndPublish = async () => {
    setError("");
    setMessage("");
    setPublishing(true);
  
    if (!slug || !category || !tags || !imageUrl) {
      setError("Slug, category, tags, and an uploaded main image are required.");
      setPublishing(false);
      return;
    }
  
    if (!sections[0].title.trim() || !sections[0].content[0].value.trim()) {
      setError("At least one section with a title and content is required.");
      setPublishing(false);
      return;
    }
  
    try {
      // Process all paragraphs to ensure links are detected
      const processedSections = sections.map((section) => {
        const processedContent = section.content.map((item) => {
          let processedItem = {
            type: item.type,
            value: item.value ?? "", 
          };
  
          if (item.type === "paragraph") {
            processedItem.processedContent = processParagraphLinks(item.value || "");
          }
  
          return processedItem;
        });
  
        return {
          title: section.title || "Untitled Section",
          content: processedContent.filter((item) => item.value.trim() !== ""),
        };
      });
  
      // Filter out empty sections
      const validSections = processedSections.filter(
        (section) => section.title.trim() && section.content.length > 0
      );
  
      const blogData = {
        category: category || "Uncategorized",
        tags: tags || "General",
        slug: slug || "untitled-blog",
        imageUrl: imageUrl || "",
        sections: validSections,
        publishedBy: `${user.firstName || "Unknown"} ${user.lastName || "User"}`,
        createdAt: serverTimestamp(),
      };
  
  
      await addDoc(collection(firestore, "blogs"), blogData);
  
      setMessage("Blog published successfully!");
      resetForm();
    } catch (err) {
      console.error("Firestore error:", err);
      setError("Failed to publish blog.");
    } finally {
      setPublishing(false);
    }
  };
  

  const resetForm = () => {
    setCategory("");
    setTags("");
    setSlug("");
    setImageURL("");
    setUploadedImage(null);
    setPreviewUrl(null);
    setSections([{ 
      title: "", 
      content: [{ type: "paragraph", value: "", processedContent: null }] 
    }]);
  };
  const removeContentItem = (sectionIndex, contentIndex) => {
    const newSections = [...sections];
    // Don't remove if it's the only content item
    if (newSections[sectionIndex].content.length > 1) {
      newSections[sectionIndex].content.splice(contentIndex, 1);
      setSections(newSections);
    } else {
      setError("Each section must have at least one content item");
    }
  };

  const removeSection = (sectionIndex) => {
    // Don't remove if it's the only section
    if (sections.length > 1) {
      const newSections = [...sections];
      newSections.splice(sectionIndex, 1);
      setSections(newSections);
    } else {
      setError("You must have at least one section");
    }
  };

  // Function to validate YouTube/Vimeo URLs
  const isValidVideoUrl = (url) => {
    return (
      url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*/) !== null
    );
  };


    // Component to render paragraph text with links
    const ParagraphWithLinks = ({ processedContent }) => {
      if (!processedContent || !processedContent.processed) {
        return <p>{processedContent?.raw || ""}</p>;
      }
      
      return (
        <p>
          {processedContent.processed.map((part, index) => {
            if (part.type === 'text') {
              return <span key={index}>{part.content}</span>;
            } else if (part.type === 'link') {
              return (
                <Link 
                  key={index} 
                  href={part.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {part.text}
                </Link>
              );
            }
            return null;
          })}
        </p>
      );
    };

    

  return (
    <div className="h-[82vh] flex flex-col">
      {/* Static Top Section */}
      <div className="h-28 p-4 flex flex-col justify-center">
        <div className="h-20 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold mb-4">Add a New Blog Post</h1>
          <div>
            <button onClick={generateSlug} className="p-2 mb-2
              mr-4 py-2 px-4
              rounded-md border-0
              text-sm font-semibold
              bg-brandFadedGreen text-brandTextGreen
              hover:bg-brandTextGreen hover:text-white">
              Generate Link
            </button>
            <button onClick={addSection} className="p-2 mb-2
              mr-4 py-2 px-4
              rounded-md border-0
              text-sm font-semibold
              bg-brandFadedGreen text-brandTextGreen
              hover:bg-brandTextGreen hover:text-white">
              Add New Section
            </button>
            {publishing ? (
              <button className="p-2 mb-2
                mr-4 py-2 px-4
                rounded-md border-0
                text-sm font-semibold
                bg-brandFadedGreen text-brandTextGreen
                hover:bg-brandTextGreen hover:text-white">
                <div className="flex justify-center">
                  <div className="h-4 w-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </button>
            ) : (
              <button onClick={validateAndPublish} className="p-2 mb-2
                mr-4 py-2 px-4
                rounded-md border-0
                text-sm font-semibold
                bg-brandFadedGreen text-brandTextGreen
                hover:bg-brandTextGreen hover:text-white">
                Publish Blog
              </button>
            )}
          </div>
        </div>
        {error && <p className="bg-red-500 block text-sm font-medium text-white rounded-md p-2">{error}</p>}
        {message && <p className="bg-green-500 block text-sm font-medium text-white rounded-md p-2">{message}</p>}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Blog Category</label>
        <select 
         value={selectedCategory}
         onChange={handleCategorySelect}
          className="block text-sm font-medium text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-3"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
          ))}
        </select>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={handleTagChange}
              placeholder="comma separated, max 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={(tags.match(/,/g) || []).length >= 3}
            />
            <p className="block text-sm font-medium text-gray-700 text-right">Remaining Commas Allowed: {remainingTags}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Public Link</label>
            <input
              type="text"
              value={slug ? `/blogs/${slug}` : ""}
              readOnly
              className="block text-sm font-medium text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Blog Image (.jpeg, .jpg, .png)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".jpeg,.jpg,.png"
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-brandFadedGreen file:text-brandTextGreen
              hover:file:bg-brandTextGreen hover:file:text-white"
              disabled={uploading}
            />
          </div>

          {previewUrl && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Preview:</h3>
              <div className="relative h-48 w-full">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edit Image Name (without extension)
            </label>
            <input
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter image name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={uploadFile}
            disabled={uploading || !file || !imageName.trim()}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${uploading || !file || !imageName.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {uploading ? "Uploading Image..." : "Upload Main Blog Image"}
          </button>

          {uploadedImage && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Uploaded Main Image:</h3>
              <div className="space-y-2">
                <div className="relative h-48 w-full">
                  <Image
                    src={uploadedImage?.imageUrl}
                    alt={uploadedImage.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="text-sm">
                  <p>Name: {uploadedImage.name}</p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image URL</label>
            <input
              type="text"
              value={uploadedImage?.imageUrl || ""}
              onChange={(e) => setImageURL(e.target.value)}
              className="block text-sm font-medium text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>

          {/* Blog Sections */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Blog Content Sections</h2>
            
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border p-4 mb-6 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold">Section {sectionIndex + 1}</h3>
                  {sections.length > 1 && (
                    <button 
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Section
                    </button>
                  )}
                </div>
                
                <input
                  type="text"
                  placeholder="Enter Section Title"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                  className="block p-2 mb-4 text-md font-medium text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => addContentItem(sectionIndex, "paragraph")}
                    className="p-2 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-brandFadedGreen text-brandTextGreen hover:bg-brandTextGreen hover:text-white"
                  >
                    Add Paragraph
                  </button>
                  <button 
                    onClick={() => addContentItem(sectionIndex, "image")}
                    className="p-2 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-brandFadedGreen text-brandTextGreen hover:bg-brandTextGreen hover:text-white"
                  >
                    Add Image
                  </button>
                  <button 
                    onClick={() => addContentItem(sectionIndex, "video")}
                    className="p-2 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-brandFadedGreen text-brandTextGreen hover:bg-brandTextGreen hover:text-white"
                  >
                    Add Video
                  </button>
                </div>
                
                {section.content.map((content, contentIndex) => (
                  <div key={contentIndex} className="mb-4 p-3 border rounded-md bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="capitalize text-sm font-medium text-gray-700">
                        {content.type}
                      </span>
                      {section.content.length > 1 && (
                        <button
                          onClick={() => removeContentItem(sectionIndex, contentIndex)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    {content.type === "paragraph" && (
                      <div>
                        <textarea
                          rows="5"
                          placeholder="Enter paragraph text (URLs will be automatically detected as links)"
                          value={content.value}
                          onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                          className="block p-2 text-sm font-medium text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                        />
                        
                        {/* Preview section showing detected links */}
                        {content.value && (
                          <div className="mt-2 border-t pt-2">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Preview with Links:</h4>
                            <div className="p-2 bg-gray-50 rounded">
                              <ParagraphWithLinks 
                                processedContent={processParagraphLinks(content.value)} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {content.type === "image" && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".jpeg,.jpg,.png"
                            className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-100 file:text-blue-700
                            hover:file:bg-blue-200"
                            disabled={uploading}
                          />
                          
                          <input
                            type="text"
                            placeholder="Image name"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          
                          <button
                            onClick={() => uploadSectionImage(sectionIndex, contentIndex)}
                            disabled={uploading || !file || !imageName.trim()}
                            className={`px-3 py-2 rounded-md text-white text-sm
                              ${uploading || !file || !imageName.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'}`}
                          >
                            {uploading ? "Uplaoding..." : "Upload"}
                          </button>
                        </div>
                        
                        {previewUrl && (
                          <div className="relative h-36 w-full">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-contain rounded-lg"
                            />
                          </div>
                        )}
                        
                        {content.value && (
                          <div>
                            <p className="text-sm font-medium mb-2">Current Image:</p>
                            <div className="relative h-36 w-full">
                              <Image
                                src={content.value}
                                alt="Section image"
                                fill
                                className="object-contain rounded-lg"
                              />
                            </div>
                          </div>
                        )}
                        
                        <input
                          type="text"
                          readOnly
                          placeholder="Image URL (automatically filled after upload)"
                          value={content.value || ""}
                          onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                    
                    {content.type === "video" && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Enter YouTube or Vimeo URL"
                          value={content.value}
                          onChange={(e) => updateContentItem(sectionIndex, contentIndex, e.target.value)}
                          className="block p-2 text-sm font-medium text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {content.value && !isValidVideoUrl(content.value) && (
                          <p className="text-red-500 text-sm">Please enter a valid YouTube or Vimeo URL</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}