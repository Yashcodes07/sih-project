"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";

interface NavbarProps {
  userName?: string;
  userProfilePic?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userProfilePic }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user; // NextAuth user

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-blue-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-2xl font-bold text-white">
              Crowd/Sync
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-gray-700">
              Home
            </Link>
            <Link href="/map" className="text-white hover:text-gray-700">
              Map View
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-700 hover:text-white">
                My Reports
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!user ? (
              // ✅ If NOT logged in
              <button
                onClick={() => signIn()} // NextAuth signIn
                className="bg-transparent text-white px-4 py-2 rounded-lg border-2 hover:bg-blue-800"
              >
                Login
              </button>
            ) : (
              // ✅ If logged in
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.image || userProfilePic ? (
                    <img
                      src={(user.image as string) || (userProfilePic as string)}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-600" />
                  )}
                  <span className="hidden md:block text-gray-700">
                    {user.name}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
                    <ul className="py-1">
                      <li>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Reports
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-6 h-0.5 bg-gray-600"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-2">
          <Link href="/" className="block text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/map" className="block text-gray-700 hover:text-blue-600">
            Map View
          </Link>
          {user && (
            <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600">
              My Reports
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
