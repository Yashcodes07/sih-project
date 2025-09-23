"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First check credentials with our custom API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Redirect to register when credentials are invalid (mirrors register page UX)
        if (data?.error === "Invalid email or password") {
          setError("Invalid credentials. Please register if you don't have an account.");
          setTimeout(() => {
            router.push("/register");
          }, 2000);
          return;
        }

        setError(data.error || "Login failed");
        return;
      }

      // 🔧 FIXED: Handle different response types
      if (data.verified) {
        // User is already verified - proceed with NextAuth login
        const result = await signIn("credentials", {
          redirect: false,
          email: email.trim(),
          password: password.trim(),
        });

        if (result?.error) {
          setError("Login failed. Please try again.");
        } else if (result?.ok) {
          router.push("/");
        }
      } else if (data.requiresOTP) {
        // User needs OTP verification - redirect to OTP page
        router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}&type=login&role=${data.role}`);
      } else {
        setError("Unexpected response from server");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-400 hover:text-blue-500 font-semibold"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
