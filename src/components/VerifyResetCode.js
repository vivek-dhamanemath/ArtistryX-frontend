"use client";
import { useState } from "react";
import { verifyResetCode } from "@/services/authService";

export default function VerifyResetCode() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await verifyResetCode(email, token);
    setMessage(response.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">🔑 Verify Reset Code</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded w-full mb-2" />
        <input type="text" placeholder="Enter Reset Code" value={token} onChange={(e) => setToken(e.target.value)} required className="border p-2 rounded w-full mb-2" />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Verify Code</button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
