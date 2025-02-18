"use client";
import { useState } from "react";
import { requestResetCode, verifyResetCode, resetPassword } from "@/services/authService";

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
    setMessage("🔄 Sending code...");
    try {
      const response = await requestResetCode(email);
      setMessage("✅ " + response.message);
      setStage(2);
    } catch (error) {
      if (error.message.includes("Reset code already sent")) {
        setMessage("⚠️ Reset code already sent to your email. Please check or wait 10 minutes.");
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
      setStage(3); // Move to password reset step
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
      const response = await resetPassword(email, newPassword);
      setMessage("✅ " + response.message);
      setStage(4); // Password reset successful
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">🔑 Forgot Password</h2>
        
        {stage === 1 && (
          <>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded w-full mb-2" />
            <button onClick={handleSendCode} className="w-full bg-blue-500 text-white p-2 rounded">Send Reset Code</button>
          </>
        )}

        {stage === 2 && (
          <>
            <input type="text" placeholder="Enter Reset Code" value={resetCode} onChange={(e) => setResetCode(e.target.value)} required className="border p-2 rounded w-full mb-2" />
            <button onClick={handleVerifyCode} className="w-full bg-green-500 text-white p-2 rounded">Verify Code</button>
          </>
        )}

        {stage === 3 && (
          <>
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="border p-2 rounded w-full mb-2" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="border p-2 rounded w-full mb-2" />
            <button onClick={handleResetPassword} className="w-full bg-green-500 text-white p-2 rounded">Update Password</button>
          </>
        )}

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
