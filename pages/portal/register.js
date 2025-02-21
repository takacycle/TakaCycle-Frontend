import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from "@/firebase/firebase";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // Import eye icons

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();

    // Function to validate password complexity
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    // Function to hide errors after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true); // Show spinner

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false); // Stop spinner
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters, including uppercase, lowercase, number, and special character.");
            setLoading(false); // Stop spinner
            return;
        }

        try {
            // Firebase authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);

            // Store user data (local storage, state, or database)
            localStorage.setItem(
                'registrationData',
                JSON.stringify({ firstName, lastName, gender, email })
            );

            setMessage('Registration successful! Please check your email for verification.');
            setLoading(false); // Stop spinner

            // Clear form fields
            setFirstName('');
            setLastName('');
            setGender('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Redirect to login or dashboard after a delay
            setTimeout(() => {
                router.push('/portal/login');
            }, 2000);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An Unknown Error Occurred");
            }
            setLoading(false); // Stop spinner
        }
    };

    return (
        <>
            <Head>
                <title>TakaCycle | Register</title>
            </Head>
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-screen-sm px-4 py-16 sm:px-6 lg:px-8">
                    <form onSubmit={handleRegister} className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow-md">
                        <div className="mx-auto max-w-lg text-center">
                            <Link href="/" className="inline-block">
                                <span className="sr-only">Home</span>
                                <Image
                                    src="/assets/brand-logo.svg"
                                    alt="logo"
                                    width={100}
                                    height={100}
                                    className="mx-auto w-32"
                                />
                            </Link>
                        </div>

                        {error && <p className="text-white text-center bg-red-500 p-1 rounded-md">{error}</p>}
                        {message && <p className="text-white text-center bg-green-500 p-1 rounded-md">{message}</p>}

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="w-full rounded-lg border-gray-300 p-3 text-sm"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="w-full rounded-lg border-gray-300 p-3 text-sm"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <select
                            className="w-full rounded-lg border-gray-300 p-3 text-sm"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select Gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-lg border-gray-300 p-3 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Password Input with Toggle */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full rounded-lg border-gray-300 p-3 text-sm"
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

                        {/* Confirm Password Input with Toggle */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                className="w-full rounded-lg border-gray-300 p-3 text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-3 flex items-center"
                            >
                                {showConfirmPassword ? <EyeOffIcon className="w-5 h-5 text-gray-500" /> : <EyeIcon className="w-5 h-5 text-gray-500" />}
                            </button>
                        </div>

                        {/* Show spinner when loading */}
                        {loading ? (
                            <div className="flex justify-center">
                                <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-brandGreen px-5 py-3 text-sm font-medium text-white"
                            >
                                Sign Up
                            </button>
                        )}

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link className="underline text-brandGreen" href="/portal/login">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
