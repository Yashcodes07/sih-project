"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Centered Content */}
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-gray-800 leading-tight">
                Report Civic Issues,
                <span className="text-blue-600 block">Make Jharkhand Better</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Empowering citizens of Jharkhand to report and resolve civic problems faster.
                Together, we can create cleaner and safer cities.
              </p>

              {/* Call to Action */}
              <div className="space-y-4 pt-8">
                <button
                  onClick={() => router.push("/map")}
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg mr-4"
                >
                  View Live Dashboard
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  View Reports Summary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Join The Digital Governance Revolution
            </h2>
            <p className="text-lg text-gray-600">
              Empowering citizens of Jharkhand to report and resolve civic problems faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Reporting</h3>
              <p className="text-gray-600">Report issues with just a few taps using our mobile app</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track the progress of your reports in real-time</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Government Connect</h3>
              <p className="text-gray-600">Direct connection with municipal authorities</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
