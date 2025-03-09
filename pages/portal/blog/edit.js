import React, { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from "@firebase/firestore"
import { firestore } from "@/firebase/firebase";

function EditBlog() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");

  useEffect(() => {
    fetchBlogs();
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

  // Function to fetch all blogs
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, "blogs"));
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle blog status between 'Draft' and 'Published'
  const toggleBlogStatus = async (blogId, currentStatus) => {
    setIsLoading(true);
    try {
      const newStatus = currentStatus === 'Draft' ? 'Published' : 'Draft';
      const blogRef = doc(firestore, "blogs", blogId);
      await updateDoc(blogRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      setMessage(`Blog status updated to ${newStatus}`);
      fetchBlogs(); // Refresh the blog list
    } catch (err) {
      console.error("Error updating blog status:", err);
      setError("Failed to update blog status.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to truncate title to 30 characters
  const truncateTitle = (title) => {
    if (!title) return 'No title';
    return title.length > 30 ? `${title.substring(0, 30)}...` : title;
  };

  return (
    <>
      <div className="h-[82vh] flex flex-col">
        {/* Static Top Section */}
        <div className="h-28 p-4 flex flex-col justify-center">
          <div className="h-20 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold mb-4">View and Change Status of Blog</h1>
          </div>
          {error && <p className="bg-red-500 block text-sm font-medium text-white rounded-md p-2">{error}</p>}
          {message && <p className="bg-green-500 block text-sm font-medium text-white rounded-md p-2">{message}</p>}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading blogs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
                <thead>
                  <tr className="divide-x divide-gray-200">
                    <th className="py-3 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Name
                    </th>
                    <th className="py-3 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Status
                    </th>
                    <th className="py-3 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View Blog
                    </th>
                    <th className="py-3 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.length > 0 ? (
                    blogs.map((blog) => {
                      const status = blog.status || 'Draft';
                      return (
                        <tr key={blog.id} className="hover:bg-gray-50 divide-x divide-gray-200">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">
                            {truncateTitle(blog.sections && blog.sections[0] ? blog.sections[0].title : 'No title')}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {status === 'Draft' ? (
                                <button
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-xs"
                                  onClick={() => window.open(`/blog/draft/${blog.id}`, '_blank')}
                                >
                                  View Draft
                                </button>
                              ) : (
                                <button
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-xs"
                                  onClick={() => window.open(`/blog/preview/${blog.id}`, '_blank')}
                                >
                                  View Published
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            <button
                              className={`font-bold py-1 px-3 rounded text-xs ${
                                status === 'Draft' 
                                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              }`}
                              onClick={() => toggleBlogStatus(blog.id, status)}
                            >
                              {status === 'Draft' ? 'Set as Published' : 'Set as Draft'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 px-6 text-sm text-center text-gray-500">
                        No blogs found. Create a new blog to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EditBlog;