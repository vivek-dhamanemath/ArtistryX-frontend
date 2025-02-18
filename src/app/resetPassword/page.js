"use client";
import { useState } from "react";
import { requestResetCode, verifyResetCode, updatePassword } from "@/services/authService";
import Link from "next/link";
import UserHeader from "@/components/UserHeader";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState(1);
  const [message, setMessage] = useState("");

  const handleSendCode = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      const response = await requestResetCode(email);
      setMessage(response.message);
      setStage(2);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVerifyCode = async () => {
    if (!resetCode) {
      setMessage("Please enter the reset code");
      return;
    }

    try {
      const response = await verifyResetCode(email, resetCode);
      setMessage(response.message);
      setStage(3);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await updatePassword(email, newPassword);
      setMessage(response.message);
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="h-screen fixed inset-0 bg-gradient-to-br from-gray-900 via-zinc-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <UserHeader />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/home" 
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-white">Back to Home</span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-400">Change your account password securely</p>
          </div>

          <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
            {stage === 1 && (
              <div className="space-y-4">
                <p className="text-gray-300 text-center mb-6">Enter your email to receive a reset code</p>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 backdrop-blur-sm"
                />
                <button 
                  onClick={handleSendCode} 
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium"
                >
                  Send Reset Code
                </button>
              </div>
            )}

            {stage === 2 && (
              <div className="space-y-4">
                <p className="text-gray-300 text-center mb-6">Enter the verification code sent to your email</p>
                <input 
                  type="text" 
                  placeholder="Enter Reset Code" 
                  value={resetCode} 
                  onChange={(e) => setResetCode(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 backdrop-blur-sm"
                />
                <button 
                  onClick={handleVerifyCode} 
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium"
                >
                  Verify Code
                </button>
              </div>
            )}

            {stage === 3 && (
              <div className="space-y-4">
                <p className="text-gray-300 text-center mb-6">Create your new password</p>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 backdrop-blur-sm mb-4"
                />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 backdrop-blur-sm"
                />
                <button 
                  onClick={handleResetPassword} 
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium"
                >
                  Update Password
                </button>
              </div>
            )}

            {message && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 text-center animate-fadeIn">
                <p className="text-white">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
