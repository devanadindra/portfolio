import React, { useState } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import "animate.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="animate__animated animate__fadeInDown animate__fast Navbar-header fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="block md:hidden lg:order-last lg:h-full">
            <button
              className="rounded p-2 text-[#8c2b7a] transition hover:text-gray-600/75"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
          <div className="md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="#">
              <span className="sr-only">Home</span>
              <span className="font-serif text-[#8c2b7a] font-bold">
                devanadindra
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="#Home"
                  >
                    {" "}
                    Home{" "}
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="#About"
                  >
                    {" "}
                    About{" "}
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="#certifications"
                  >
                    {" "}
                    Certifications{" "}
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="#Projects"
                  >
                    {" "}
                    Projects{" "}
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="#ContactForm"
                  >
                    {" "}
                    Contact{" "}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav aria-label="Global">
            <ul className="flex flex-col items-center gap-6 text-sm pb-3">
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#Home"
                >
                  {" "}
                  Home{" "}
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#About"
                >
                  {" "}
                  About{" "}
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#certifications"
                >
                  {" "}
                  Certifications{" "}
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#Projects"
                >
                  {" "}
                  Projects{" "}
                </a>
              </li>
              <li>
                <a
                  className="text-gray-500 transition hover:text-gray-500/75"
                  href="#ContactForm"
                >
                  {" "}
                  Contact{" "}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
