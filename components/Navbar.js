import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { CloseCircle } from "iconsax-react";

function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Story", path: "/our-story" },
    { name: "Our Team", path: "/our-team" },
    { name: "Our Project", path: "/our-project" },
    { name: "Blog", path: "/blog" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white mt-5">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <Link className="block text-teal-600" href="/">
                <span className="sr-only">Home</span>
                <Image
                  src={"/assets/brand-logo.svg"}
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-32"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-8 text-sm  py-3 px-6 rounded-full border-2 border-black">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.path}
                        className={`text-black font-alton transition hover:text-gray-500/75 ${
                          router.pathname === link.path
                            ? "text-brandGreen font-bold"
                            : "font-normal"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Support Us button for larger screens */}
              <div className="sm:flex sm:gap-4">
                <div className="hidden sm:flex">
                  <Link
                    className="rounded-full bg-brandGreen hover:bg-brandTextGreen px-5 py-4 text-sm font-alton font-normal text-white"
                    href="#"
                  >
                    Support Us
                  </Link>
                </div>
              </div>

              {/* Hamburger menu for mobile */}
              <div className="block md:hidden bg-gray-100 rounded-lg">
                <button
                  className="rounded p-2 text-black transition hover:text-gray-600/75"
                  onClick={toggleMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Popup Card) */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed inset-0 z-50 p-6 flex items-center justify-center">
              <nav className="relative bg-white p-12 rounded-lg w-72">
                {/* Close button at the far right end */}
                <button
                  onClick={closeMenu}
                  className="absolute top-4 right-4 text-gray-600"
                >
                  <CloseCircle
                    size="32"
                    variant="Bold"
                    className="text-slate-700"
                  />
                </button>

                <ul className="flex flex-col gap-4 items-center justify-center text-center">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.path}
                        className={`text-lg block text-black transition hover:text-gray-500/75 ${
                          router.pathname === link.path
                            ? "font-bold"
                            : "font-normal"
                        }`}
                        onClick={closeMenu} // Close menu on link click
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
