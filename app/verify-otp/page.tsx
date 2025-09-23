"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const type = searchParams.get('type'); // 'register' or 'login'
  const role = searchParams.get('role'); // 'officer' or 'citizen'

  const [otp, setOtp] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [error, setError] = useState("");
  const [otpStatus, setOtpStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    if (!email || !type || !role) {
      router.push('/login');
      return;
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, type, role, router]);

  // 🔧 FIXED: Auto-verify OTP when 6 digits entered
  useEffect(() => {
    if (otp.length === 6) {
      verifyOTP();
    } else if (otp.length < 6) {
      // Reset status when user is still typing
      setOtpStatus('idle');
      setError("");
    }
  }, [otp]);

  // 🔧 FIXED: Auto-submit logic - only when both conditions are met AND not loading
  useEffect(() => {
    if (loading) return; // Don't auto-submit while processing
    
    if (role === 'officer' && aadhaar.replace(/\s/g, '').length === 12 && otpStatus === 'valid') {
      handleSubmit();
    } else if (role === 'citizen' && otpStatus === 'valid') {
      handleSubmit();
    }
  }, [aadhaar, otpStatus, role, loading]);

  const verifyOTP = async () => {
    if (otp.length !== 6) return;

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type })
      });

      const data = await res.json();

      if (res.ok) {
        setOtpStatus('valid');
        setError("");
      } else {
        setOtpStatus('invalid');
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setOtpStatus('invalid');
      setError('Failed to verify OTP');
    }
  };

  const handleSubmit = async () => {
    // 🔧 FIXED: Validation logic
    if (!otp || otp.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }

    if (otpStatus !== 'valid') {
      setError("Please enter valid OTP");
      return;
    }

    if (role === 'officer' && (!aadhaar || aadhaar.replace(/\s/g, '').length !== 12)) {
      setError("Please enter valid Aadhaar number");
      return;
    }

    setLoading(true);
    setError(""); // Clear any existing errors

    try {
      const res = await fetch('/api/auth/complete-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          type,
          role,
          aadhaar: role === 'officer' ? aadhaar.replace(/\s/g, '') : undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Sign in user using NextAuth
        const signInResult = await signIn("credentials", {
          email,
          password: "verified", // Special flag for verified users
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push("/");
        } else {
          setError("Failed to sign in");
        }
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  const handleAadhaarChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 12);
    // Format with spaces after every 4 digits
    const formatted = numericValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaar(formatted);
  };

  // 🔧 FIXED: Button state logic
  const isFormComplete = () => {
    if (role === 'officer') {
      return otpStatus === 'valid' && aadhaar.replace(/\s/g, '').length === 12;
    } else {
      return otpStatus === 'valid';
    }
  };

  const shouldShowGrayButton = () => {
    return loading || isFormComplete();
  };

  if (!email || !type || !role) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {type === 'register' ? 'Complete Registration' : 'Complete Login'}
        </h2>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

        <div className="space-y-6">
          {/* Email Display */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 cursor-not-allowed"
            />
          </div>

          {/* OTP Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-300 font-semibold">Enter OTP</label>
              <span className={`text-sm ${timeLeft <= 30 ? 'text-red-400' : 'text-blue-400'}`}>
                ⏰ {formatTime(timeLeft)}
              </span>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg bg-gray-900 text-white border text-center text-2xl tracking-widest focus:outline-none focus:ring-2 ${
                otpStatus === 'valid' ? 'border-green-500 focus:ring-green-500' :
                otpStatus === 'invalid' ? 'border-red-500 focus:ring-red-500' :
                'border-gray-700 focus:ring-blue-500'
              }`}
              placeholder="000000"
              maxLength={6}
            />
            {otpStatus === 'valid' && (
              <p className="text-green-400 text-sm mt-1">✓ OTP verified successfully</p>
            )}
            {otpStatus === 'invalid' && (
              <p className="text-red-400 text-sm mt-1">✗ Invalid OTP</p>
            )}
          </div>

          {/* Aadhaar Input - Only for Officers */}
          {role === 'officer' && (
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Aadhaar Number <span className="text-blue-400">(Demo)</span>
              </label>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => handleAadhaarChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-wider"
                placeholder="0000 0000 0000"
              />
              <p className="text-gray-400 text-xs mt-1">
                Enter any 12-digit number for demo purposes
              </p>
            </div>
          )}

          {/* 🔧 FIXED: Submit Button - Always blue unless gray conditions met */}
          <button
            onClick={handleSubmit}
            disabled={shouldShowGrayButton()}
            className={`w-full py-3 px-4 rounded-lg font-bold transition duration-200 ${
              shouldShowGrayButton()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            }`}
          >
            {loading ? "Completing..." : "Complete Verification"}
          </button>

          {/* Demo Info */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-4">
            <h4 className="text-blue-300 font-semibold mb-2">Demo Mode</h4>
            <p className="text-blue-200 text-sm mb-1">
              <strong>Demo OTP:</strong> 121212
            </p>
            {role === 'officer' && (
              <p className="text-blue-200 text-sm">
                <strong>Aadhaar:</strong> Any 12-digit number
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTPPage;
