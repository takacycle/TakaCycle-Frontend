import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, deleteDoc } from "@firebase/firestore"
import { firestore } from "@/firebase/firebase"; 

function BlogCategory() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ firstName: "Unknown", lastName: "User" });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    createdBy: ""
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load user data from localStorage
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

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear message after 10 seconds
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category selection from dropdown
  const handleCategorySelect = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setShowDeleteConfirm(false);
    
    if (categoryId === "") {
      // Reset form if "Select category" is chosen
      setFormData({
        id: null,
        name: "",
        description: "",
        createdBy: `${user.firstName} ${user.lastName}`
      });
      return;
    }

    // Find the selected category and populate form
    const selectedCat = categories.find(cat => cat.id === categoryId);
    if (selectedCat) {
      setFormData({
        id: selectedCat.id,
        name: selectedCat.name,
        description: selectedCat.description,
        createdBy: selectedCat.createdBy
      });
    }
  };

  // Handle form reset
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      createdBy: `${user.firstName} ${user.lastName}`
    });
    setSelectedCategory("");
    setShowDeleteConfirm(false);
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!formData.id) return;
    
    setIsLoading(true);
    try {
      await deleteDoc(doc(firestore, "blog_categories", formData.id));
      setMessage("Category deleted successfully!");
      await fetchCategories();
      resetForm();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Validate inputs
    if (!formData.name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("Category description cannot be empty.");
      return;
    }

    setIsLoading(true);
    
    try {
      if (formData.id) {
        // Update existing category
        await updateDoc(doc(firestore, "blog_categories", formData.id), {
          name: formData.name,
          description: formData.description,
          updatedAt: serverTimestamp(),
          updatedBy: `${user.firstName} ${user.lastName}`
        });
        setMessage("Category updated successfully!");
      } else {
        // Create new category
        await addDoc(collection(firestore, "blog_categories"), {
          name: formData.name,
          description: formData.description,
          createdBy: `${user.firstName} ${user.lastName}`,
          createdAt: serverTimestamp()
        });
        setMessage("New category created successfully!");
      }
      
      // Refresh categories and reset form
      await fetchCategories();
      resetForm();
      
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Failed to save category.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-[82vh] flex flex-col">
        {/* Static Top Section */}
        <div className="h-28 p-4 flex flex-col justify-center">
          <div className="h-20 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold mb-4">Add/ Edit Blog Categories</h1>
            <div>
              <button 
                onClick={resetForm}
                className="p-2 mb-2 mr-4 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-brandFadedGreen text-brandTextGreen hover:bg-brandTextGreen hover:text-white"
              >
                Create New Category
              </button>
            </div>
          </div>
          {error && <p className="bg-red-500 block text-sm font-medium text-white rounded-md p-2">{error}</p>}
          {message && <p className="bg-green-500 block text-sm font-medium text-white rounded-md p-2">{message}</p>}
        </div>
     
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {/* Categories Dropdown - Only show if categories exist */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Category to Edit
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategorySelect}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Create New Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Category Name"
                required
              />
            </div>
            
            {/* Category Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Category Description"
                required
              />
            </div>
            
            {/* Created By - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {formData.id ? 'Created By' : 'Will be created by'}
              </label>
              <input
                type="text"
                value={formData.id ? formData.createdBy : `${user.firstName} ${user.lastName}`}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brandTextGreen hover:bg-brandTextGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandTextGreen"
              >
                {isLoading ? 'Processing...' : formData.id ? 'Update Category' : 'Create Category'}
              </button>
              
              {/* Delete Button - Only show when a category is selected */}
              {formData.id && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              )}
              
              {/* Delete Confirmation Buttons */}
              {showDeleteConfirm && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteCategory}
                    disabled={isLoading}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default BlogCategory;