"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // Redirect to login after logout
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white flex justify-between items-center shadow-lg z-50">
      <h1 className="text-3xl font-bold tracking-wide">🎭 ArtistryX</h1>
      <div className="flex space-x-6">
        {!isAuthPage && <Link href="/" className="hover:underline text-lg">Home</Link>}
        {token ? (
          <>
            {!isAuthPage && (
              <div className="relative">
                <button onClick={() => setShowLogoutConfirm(true)} className="hover:underline text-lg">Logout</button>
                {showLogoutConfirm && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black p-4 rounded shadow-lg">
                    <p>Are you sure you want to logout?</p>
                    <div className="flex justify-between mt-2">
                      <button onClick={handleLogout} className="bg-red-500 text-white px-2 py-1 rounded">Yes</button>
                      <button onClick={() => setShowLogoutConfirm(false)} className="bg-gray-300 text-black px-2 py-1 rounded">No</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {!isAuthPage && <Link href="/login" className="hover:underline text-lg">Login</Link>}
            {!isAuthPage && <Link href="/register" className="hover:underline text-lg">Register</Link>}
          </>
        )}
      </div>
    </nav>
  );
}
