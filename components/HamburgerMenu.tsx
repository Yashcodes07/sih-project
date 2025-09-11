"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const isOfficer = session?.user?.role === 'officer';

  return (
    <>
      {/* Enhanced Overlay with backdrop blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out z-40"
          onClick={onClose}
          style={{ 
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden'
          }}
        />
      )}

      {/* Sidebar Menu with higher z-index */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            {session?.user && (
              <p className="text-sm text-gray-600">
                {session.user.role === 'officer' ? '🏛️ Officer' : '👤 Citizen'} • {session.user.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col p-6 space-y-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center p-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-700 font-medium border border-transparent hover:border-blue-200"
          >
            <span className="mr-3 text-xl">🏠</span>
            Home
          </Link>
          
          {/* Reports - Available to all authenticated users */}
          <Link
            href="/reports"
            onClick={onClose}
            className="flex items-center p-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-700 font-medium border border-transparent hover:border-blue-200"
          >
            <span className="mr-3 text-xl">📊</span>
            Community Reports
          </Link>
          
          {/* Officer-only sections */}
          {isOfficer && (
            <>
              <Link
                href="/map"
                onClick={onClose}
                className="flex items-center p-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-700 font-medium border border-transparent hover:border-blue-200"
              >
                <span className="mr-3 text-xl">🗺️</span>
                Map View
                <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Officer</span>
              </Link>
            </>
          )}

          {/* Citizen notice */}
          {session?.user?.role === 'citizen' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-lg">ℹ️</span>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800">Citizen Access</h4>
                  <p className="text-xs text-blue-600 mt-1">
                    As a citizen, you can view and vote on community reports. 
                    Tracking & Map access is reserved for officers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            CrowdSync - Jharkhand
          </p>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
