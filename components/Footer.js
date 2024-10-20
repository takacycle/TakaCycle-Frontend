import React from "react";
import Link from "next/link";

function Footer() {
  return (
<div>
<footer className="bg-brandDarkGreen text-white p-6 lg:p-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Section - Company Information */}
        <div>
          <h2 className="text-2xl font-bold mb-4"><span className="text-brandFadedGreen">TakaCycle </span>Innovations</h2>
        </div>

        {/* Explore Links */}
        <div className="text-sm">
          <h3 className="text-lg font-semibold mb-2">Explore</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/our-story" className="hover:text-gray-300">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/our-team" className="hover:text-gray-300">
                Our Team
              </Link>
            </li>
            <li>
              <Link href="/our-project" className="hover:text-gray-300">
                Our Projects
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-300">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="text-sm">
          <h3 className="text-lg font-semibold mb-2">Legal</h3>
          <ul className="space-y-4">
            <li>
              <Link href="#" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                Terms of Services
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                Documentations
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media and Contact */}
        <div className="text-sm">
          <h3 className="text-lg font-semibold mb-2">Social Media</h3>
          <ul className="space-y-4">
            <li>
              <Link href="#" className="hover:text-gray-300">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                LinkedIn
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                X (Formerly Twitter)
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-300">
                YouTube
              </Link>
            </li>
          </ul>
        </div>
        {/* Bsice Info */}
        <div className="text-sm">
          <ul className="space-y-4">
            <li>
              <p href="#">
                {" "}
                TakaCycle Innovations is a nonprofit, tax-exempt charitable
                organization (Registration number CG034092823) under the
                Companies Act, 2019 (Act 992), Ghana. Donations are
                tax-deductible as allowed by law.
              </p>
            </li>
            <li>
              <Link
                href="mailto:takacycleinnovations@gmail.com"
                className="hover:text-gray-300"
              >
                takacycleinnovations@gmail.com
              </Link>
            </li>
            <li>
              <Link href="tel:+233248579906" className="hover:text-gray-300">
                +233248579906/+233550850691
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
</div>
  );
}

export default Footer;
