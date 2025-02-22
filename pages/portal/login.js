import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { serverTimestamp } from "firebase/firestore";


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // ✅ Force Firebase to refresh user info
      await user.reload();
  
      console.log("✅ User logged in:", user.email, "UID:", user.uid);
  
      if (!user.emailVerified) {
        setError('⚠️ Please verify your email before logging in.');
        setLoading(false);
        return;
      }
  
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      console.log("📌 Checking if user document exists...");
  
      // ✅ Initialize userData properly
      let userData = { firstName: "N/A", lastName: "N/A", lastLogin: null };
  
      if (!userDoc.exists()) {
        console.log("🚀 User document does not exist, creating a new one...");
        const registrationData = localStorage.getItem("registrationData");
  
        if (registrationData) {
          try {
            userData = JSON.parse(registrationData);
          } catch (error) {
            console.error("⛔ Error parsing registration data:", error);
          }
        }
  
        await setDoc(userDocRef, {
          firstName: userData.firstName || "N/A",
          lastName: userData.lastName || "N/A",
          email: user.email,
          emailVerified: user.emailVerified,
          status: 'online',
          lastLogin: serverTimestamp(),
        }, { merge: true });
  
        localStorage.removeItem("registrationData");
  
      } else {
        console.log("🔄 User document exists, updating status, lastLogin, and emailVerified...");
        
        // ✅ Extract user data from existing Firestore document
        const existingUserData = userDoc.data();
        userData = {
          firstName: existingUserData.firstName || "N/A",
          lastName: existingUserData.lastName || "N/A",
          lastLogin: new Date().toISOString()
        };
  
        await setDoc(userDocRef, {
          status: 'online',
          lastLogin: serverTimestamp(),
          emailVerified: user.emailVerified,
        }, { merge: true });
  
        console.log("✅ User document updated successfully!");
      }
  
      // ✅ Save user info to localStorage
      localStorage.setItem(
        'loggedIn',
        JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          lastLogin: userData.lastLogin,
        })
      );
  
      console.log("📝 User data saved to localStorage:", userData);
  
      // Redirect the user after successful login
      router.push('/portal');
  
    } catch (error) {
      console.error("🔥 Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>TakaCycle | Login</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md px-6 py-12 bg-white rounded-lg shadow-md text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/" className="inline-block">
              <span className="sr-only">Home</span>
              <Image
                src="/assets/brand-logo.svg"
                alt="TakaCycle Logo"
                width={100}
                height={100}
                className="mx-auto w-32"
              />
            </Link>
          </div>

          {/* Error Message */}
          {error && <p className="text-white text-center bg-red-500 p-1 rounded-md">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <input
                type="email"
                className="w-full rounded-lg border-gray-300 p-3 text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input with Eye Icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border-gray-300 p-3 text-sm pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5 text-gray-500" /> : <EyeIcon className="w-5 h-5 text-gray-500" />}
              </button>
            </div>

            {/* Sign In Button or Spinner */}
            {loading ? (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full rounded-lg bg-brandGreen hover:bg-green-600 text-white py-3 font-medium transition duration-300"
              >
                Sign In
              </button>
            )}

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              No account? <Link href="/portal/register" className="underline text-brandGreen">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
