"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import HamburgerMenu from "./HamburgerMenu";

interface NavbarProps {
  userProfilePic?: string;
}

const Navbar: React.FC<NavbarProps> = ({ userProfilePic }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <nav className="bg-white shadow-lg px-4 py-3 relative z-30">
        <div className="flex items-center justify-between">
          {/* Left Section - Hamburger + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHamburgerOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaBars size={20} className="text-gray-700" />
            </button>
            
            <Link href="/" className="text-4xl font-bold text-blue-600">
              CrowdSync
            </Link>
          </div>

          {/* Right Section - User Profile */}
          <div className="relative">
            {!user ? (
              <button
                onClick={() => signIn()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            ) : (
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {user.image || userProfilePic ? (
                    <img
                      src={user.image || userProfilePic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <FaUserCircle size={32} className="text-gray-400" />
                  )}
                  <span className="font-medium text-gray-700">{user.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <Link
                      href="/reports"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Reports
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isHamburgerOpen} 
        onClose={() => setIsHamburgerOpen(false)} 
      />
    </>
  );
};

export default Navbar;
