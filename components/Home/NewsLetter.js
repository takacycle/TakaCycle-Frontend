import React, { useState, useEffect } from "react";
import { ArrowCircleRight2 } from "iconsax-react";
function Newsletter() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if all fields are filled
    if (firstName && lastName && email) {
      setIsSubmitted(true);
      setShowModal(true);
    } else {
      setErrorMessage("All fields are required");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <section className=" mb-10 bg-green-100 p-5 lg:p-20 rounded-lg">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div>
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              Monthly Newsletter
            </h2>
            <p className="text-gray-700 mt-2 text-sm sm:text-base lg:text-lg">
              Sign up for weekly newsletter for news, stories and updates from
              our projects.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {errorMessage ? (
            <>
              <p className="text-white bg-red-600 p-3 rounded-lg text-center mt-2 text-sm sm:text-base lg:text-lg">
                {errorMessage}
              </p>
            </>
          ) : (
            <></>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="w-full flex space-x-4">
              <input
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-4 py-4 text-gray-700 placeholder-gray-500 bg-white focus:outline-none w-full rounded-l-full"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                required
                placeholder="Last Name"
                className="px-4 py-4 text-gray-700 placeholder-gray-500 bg-white focus:outline-none w-full rounded-r-full"
              />
            </div>
          </div>
          <div className="relative w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="px-4 py-4 text-gray-700 placeholder-gray-500 bg-white focus:outline-none w-full rounded-full pr-16" // Added right padding for the button
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="absolute right-0 bottom-0 top-0 text-white px-5 py-5 rounded-full flex items-center justify-center"
            >
              <ArrowCircleRight2
                size="32"
                className="text-brandTextGreen ml-3"
                variant="Bold"
              />
            </button>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className=" p-5 fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <h3 className="text-6xl">🎉</h3>
            <p className="mt-4 text-lg font-semibold">
              You&apos;ve subscribed to our newsletter!
            </p>
            <p className="mt-2 text-gray-600">
              Please check your email to confirm.
            </p>
            <button
              onClick={closeModal}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Newsletter;
