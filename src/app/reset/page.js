"use client";
import { useState } from "react";
import { requestResetCode, verifyResetCode, updatePassword } from "@/services/authService";
import { Roboto } from "next/font/google";
import Link from "next/link";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState(1);
  const [message, setMessage] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("❌ Please enter your email to send reset code.");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("❌ Invalid email format.");
      return;
    }
    setMessage("Sending code...");
    try {
      const response = await requestResetCode(email);
      setMessage("✅ " + response.message);
      setStage(2);
    } catch (error) {
      if (error.message.includes("Reset code already sent")) {
        setMessage("⚠️ Reset code already sent to your email. Please check or wait 10 minutes.");
      } else if (error.message.includes("not registered")) {
        setMessage("❌ Your email is not registered.");
      } else {
        setMessage("❌ " + error.message);
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage("Verifying code...");
    try {
      const response = await verifyResetCode(email, resetCode);
      setMessage("✅ " + response.message);
      setStage(3);
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }
    setMessage("Updating password...");
    try {
      const response = await updatePassword(email, newPassword);
      setMessage("✅ " + response.message);
      setStage(4);
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-800 via-teal-900 to-emerald-900 ${roboto.className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          <Link 
            href="/login"
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
          >
            ← Back to Login
          </Link>

          <h2 className="text-3xl font-bold mb-6 text-center text-white">Reset Password</h2>

          {stage === 1 && (
            <div className="space-y-4">
              <p className="text-gray-200 text-center mb-6">Enter your email to receive a reset code</p>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 backdrop-blur-sm"
              />
              <button 
                onClick={handleSendCode} 
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5"
              >
                Send Reset Code
              </button>
            </div>
          )}

          {stage === 2 && (
            <div className="space-y-4">
              <p className="text-gray-200 text-center mb-6">Enter the code sent to your email</p>
              <input 
                type="text" 
                placeholder="Enter Reset Code" 
                value={resetCode} 
                onChange={(e) => setResetCode(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 backdrop-blur-sm"
              />
              <button 
                onClick={handleVerifyCode} 
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5"
              >
                Verify Code
              </button>
            </div>
          )}

          {stage === 3 && (
            <div className="space-y-4">
              <p className="text-gray-200 text-center mb-6">Enter your new password</p>
              <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 backdrop-blur-sm mb-4"
              />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 backdrop-blur-sm"
              />
              <button 
                onClick={handleResetPassword} 
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5"
              >
                Update Password
              </button>
            </div>
          )}

          {message && (
            <div className="mt-4 p-4 rounded-lg backdrop-blur-sm text-center font-medium animate-fadeIn">
              <p className="text-white">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
