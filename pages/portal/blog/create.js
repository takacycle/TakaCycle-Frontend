import React, { useState, useEffect } from "react";
import Image from "next/image";
import { firestore } from "@/firebase/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  const [user, setUser] = useState([{ firstName: "", lastName: "" }])
  const [titles, setTitles] = useState([{ title: "", paragraphs: [""] }]); 
  const [publishing, setPublishing] = useState(false); // State for spinner
  
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


  const categories = ["Technology", "Health", "Finance", "Education", "Lifestyle"];

  const generateSlug = () => {
    if (!titles[0].title.trim()) {
      setError("Enter a main Title first to generate a slug for the blog.");
      return;
    }
    
    // Generate slug from first title
    const formattedSlug = titles[0].title
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

  const addTitle = () => {
    setTitles([...titles, { title: "", paragraphs: [] }]);
  };

  const updateTitle = (index, newTitle) => {
    const newTitles = [...titles];
    newTitles[index].title = newTitle;
    setTitles(newTitles);
  };

  const addParagraph = (index) => {
    const newTitles = [...titles];
    newTitles[index].paragraphs.push("");
    setTitles(newTitles);
  };

  const updateParagraph = (titleIndex, paraIndex, newText) => {
    const newTitles = [...titles];
    newTitles[titleIndex].paragraphs[paraIndex] = newText;
    setTitles(newTitles);
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
      setImageURL(result.file.imageUrl)

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
  }


  const validateAndPublish = async () => {
    setError("");
    setMessage  ("");
    setPublishing(true); 
    if (!slug || !category || !tags || !imageUrl) {
      setError("Slug, category, tags, and an uploaded image are required.");
      setPublishing(false); 
      return;
    }
    if (!titles[0].title.trim() || !titles[0].paragraphs[0].trim()) {
      setError("At least one title and one paragraph are required.");
      setPublishing(false); 
      return;
    }

    try {
      await addDoc(collection(firestore, "blogs"), {
        category,
        tags,
        slug,
        imageUrl,
        titles: titles.filter(item => item.title.trim() || item.paragraphs.some(p => p.trim())), 
        publishedBy: `${user.firstName} ${user.lastName}`,
        createdAt: serverTimestamp(),
      });

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
    setTitles([{ title: "", paragraphs: [""] }]);
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
            <button onClick={addTitle} className="p-2 mb-2
              mr-4 py-2 px-4
              rounded-md border-0
              text-sm font-semibold
              bg-brandFadedGreen text-brandTextGreen
              hover:bg-brandTextGreen hover:text-white">
              Add New Title
            </button>
            {publishing ? (<>
              <button  className="p-2 mb-2
              mr-4 py-2 px-4
              rounded-md border-0
              text-sm font-semibold
              bg-brandFadedGreen text-brandTextGreen
              hover:bg-brandTextGreen hover:text-white">
                                          <div className="flex justify-center">
                                <div className="h-4 w-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
            </button>
            </>):(<>            <button onClick={validateAndPublish} className="p-2 mb-2
              mr-4 py-2 px-4
              rounded-md border-0
              text-sm font-semibold
              bg-brandFadedGreen text-brandTextGreen
              hover:bg-brandTextGreen hover:text-white">
              Publish Blog
            </button></>)}

          </div>
        </div>
        {error && <p className=" bg-red-500 block text-sm font-medium text-white rounded-md p-2">{error}</p>}
        {message && <p className=" bg-green-500 block text-sm font-medium text-white rounded-md p-2">{message}</p>}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 ">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a Blog Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="block text-sm font-medium text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-3">
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={handleTagChange}
              placeholder="comma separated, max 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={(tags.match(/,/g) || []).length >= 3}
            />
            <p className="block text-sm font-medium text-gray-700  text-right">Remaining Commas Allowed: {remainingTags}</p>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Generate Public Link</label>
            <input
              type="text"
              value={`/blogs/${slug}`}
              onChange={handleTagChange}
              readOnly
              className="block text-sm font-medium text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"

            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image (.jpeg, .jpg, .png)
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
            {uploading ? "Uploading Image..." : "Upload Image before proceeding"}
          </button>

          {uploadedImage && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Uploaded Image:</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image Link</label>
            <input
              type="text"
              value={uploadedImage?.imageUrl}
              readOnly
              className="block text-sm font-medium text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div>
            {titles.map((item, titleIndex) => (
              <div key={titleIndex} className="border p-4 mb-4 rounded-md">
                <input
                  type="text"
                  placeholder="Enter Title"
                  value={item.title}
                  onChange={(e) => updateTitle(titleIndex, e.target.value)}
                  className="block p-2 mb-2 text-sm font-medium text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button onClick={() => addParagraph(titleIndex)} className="p-2 block w-full mb-2
              mr-4 py-2 px-4
              rounded-md border-0
              text-sm font-semibold
              bg-brandFadedGreen text-brandTextGreen
              hover:bg-brandTextGreen hover:text-white">
                  Add Paragraph
                </button>
                {item.paragraphs.map((para, paraIndex) => (
                  <textarea
                    key={paraIndex}
                    rows="7"
                    placeholder="Enter Paragraph"
                    value={para}
                    onChange={(e) => updateParagraph(titleIndex, paraIndex, e.target.value)}
                    className="block p-2 mb-2 text-sm font-medium text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
