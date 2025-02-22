import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { HomeIcon, PencilIcon, FolderIcon, LogoutIcon, PlusIcon } from '@heroicons/react/solid';
import CreateBlog from './blog/create';
import EditBlog from './blog/edit';
import UpdateBlogPage from './blog/updateBlogPage';
import Dashboard from './home';
import BlogCategory from './blog/category';


function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [activePage, setActivePage] = useState("Dashboard");
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          const userDocRef = doc(firestore, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Get user data from Firestore
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              gender: userData.gender || "",
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: "",
              lastName: "",
              gender: "",
            });
          }
        } else {
          setUser(null);
          router.push('/portal/login');
        }
      } else {
        setUser(null);
        router.push('/portal/login');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (currentUser) {

        // Update user document with offline status
        const userDocRef = doc(firestore, "users", currentUser.uid);

        await setDoc(userDocRef, {
          status: 'offline',
          lastSeen: serverTimestamp(),
        }, { merge: true });


        // Sign out from Firebase
        await signOut(auth);

        // Clear any stored data
        localStorage.clear();

        // Redirect user
        router.push('/portal/login');
      } else {
        router.push('/portal/login');
      }
    } catch (error) {
      console.error(error);

      // Attempt force logout even if there's an error
      try {
        await signOut(auth);
        localStorage.clear();
        router.push('/portal/login');
      } catch (finalError) {
        console.error(finalError);
      }
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        {/* Spinner animation */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-700 font-semibold text-lg">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>TakaCycle | Portal</title>
      </Head>

      {/* Main Container */}
      <div className="flex h-screen ">

        {/* Sidebar - Fixed 20% */}
        <div className="w-1/5 bg-white flex flex-col justify-between fixed h-full p-4">
          {/* Logo */}
          <Link className="block text-teal-600 text-center mb-4" href="/">
            <Image src={"/assets/brand-logo.svg"} alt="logo" width={100} height={100} className="w-32 mx-auto" />
          </Link>

          {/* Menu */}
          <nav className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => setActivePage("Dashboard")}
              className={`flex items-center gap-2 p-3 rounded-lg text-left w-full text-sm font-medium text-gray-700 ${activePage === "Dashboard" ? "bg-brandTextGreen text-white" : "bg-brandFadedGreen text-brandTextGreen"}`}
            >
              <HomeIcon className="w-5 h-5" />
              Dashboard
            </button>

            {/* Blog Section */}
            <button
              onClick={() => setExpandedMenu(expandedMenu === "Blog" ? null : "Blog")}
              className={`flex items-center justify-between p-3 rounded-lg w-full text-sm font-medium text-gray-700 ${expandedMenu === "Blog" ? "" : ""}`}
            >
              <div className="flex items-center gap-2">
                <PencilIcon className="w-5 h-5" />
                Blog
              </div>
              <span>{expandedMenu === "Blog" ? "▲" : "▼"}</span>
            </button>
            {expandedMenu === "Blog" && (
              <div className="pl-6 flex flex-col space-y-1">
                <button onClick={() => setActivePage("Blog Categories")} className={`p-2 text-left text-sm font-medium text-gray-700 ${activePage === "Blog Categories" ? "bg-brandTextGreen text-white rounded-md" : "bg-brandFadedGreen text-brandTextGreen rounded-md"}`}>Blog categories</button>
                <button onClick={() => setActivePage("Create Blog")} className={`p-2 text-left text-sm font-medium text-gray-700 ${activePage === "Create Blog" ? "bg-brandTextGreen text-white rounded-md" : "bg-brandFadedGreen text-brandTextGreen rounded-md"}`}>Create Blog</button>
                <button onClick={() => setActivePage("Edit Blog")} className={`p-2 text-left text-sm font-medium text-gray-700 ${activePage === "Edit Blog" ? "bg-brandTextGreen text-white rounded-md" : "bg-brandFadedGreen text-brandTextGreen rounded-md"}`}>Edit Blog</button>
                <button onClick={() => setActivePage("Update Blog Page")} className={`p-2 text-left text-sm font-medium text-gray-700 ${activePage === "Update Blog Page" ? "bg-brandTextGreen text-white rounded-md" : "bg-brandFadedGreen text-brandTextGreen rounded-md"}`}>Update Blog Page</button>
              </div>
            )}

            {/* Project Section */}
            <button
              onClick={() => setExpandedMenu(expandedMenu === "Project" ? null : "Project")}
              className={`flex items-center justify-between p-3 rounded-lg w-full text-sm font-medium text-gray-700 ${expandedMenu === "Project" ? "" : ""}`}
            >
              <div className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5" />
                Project
              </div>
              <span>{expandedMenu === "Project" ? "▲" : "▼"}</span>
            </button>
            {expandedMenu === "Project" && (
              <div className="pl-6 flex flex-col text-sm font-medium text-gray-700 space-y-1">
                <button onClick={() => setActivePage("Create Project")} className={`p-2 text-left ${activePage === "Create Project" ? "bg-brandTextGreen text-white rounded-md" : "bg-brandFadedGreen text-brandTextGreen rounded-md"}`}>Create Project</button>
                <button onClick={() => setActivePage("Edit Project")} className={`p-2 text-left ${activePage === "Edit Project" ? "bg-brandTextGreen text-white rounded-md" : "bg-brandFadedGreen text-brandTextGreen rounded-md"}`}>Edit Project</button>
                <button onClick={() => setActivePage("Update Project Page")} className={`p-2 text-left ${activePage === "Update Project Page" ? "bg-brandTextGreen text-white rounded-md" : "bg-brandFadedGreen text-brandTextGreen rounded-md"}`}>Update Project Page</button>
              </div>
            )}
          </nav>

          {/* User Profile (Fixed Bottom) */}
          {user && (
            <div className="mt-auto flex items-center p-3 bg-gray-100 rounded-lg">
              <div className="ml-3">
                <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content - 80% */}
        <div className="w-4/5 ml-auto flex flex-col">

          {/* Top Header (Fixed) with Logout Button */}
          <div className="bg-white fixed w-4/5 p-4 z-10 flex justify-between items-center">
            <h1 className="text-xl font-bold">{activePage}</h1>
            <button
              onClick={handleLogout}
              className="p-2 mb-2 flex w-36 h-10
              mr-4 py-2 px-4
              rounded-md border-0
              text-sm font-semibold
              bg-brandFadedGreen text-brandTextGreen
              hover:bg-brandTextGreen hover:text-white">
              <LogoutIcon className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Page Content */}
          <div className="p-6 mt-16">
            {activePage === "Dashboard" && <Dashboard />}
            {activePage === "Blog Categories" && <BlogCategory />}
            {activePage === "Create Blog" && <CreateBlog />}
            {activePage === "Edit Blog" && <EditBlog />}
            {activePage === "Update Blog Page" && <UpdateBlogPage />}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
