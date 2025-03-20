"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "@/components/UserHeader";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";

      if (!token || !isAdmin) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  if (!isAuthenticated) {
    return <p className="text-center text-gray-500">Checking authentication...</p>;
  }

  return (
    <div className="h-screen fixed inset-0 bg-gray-900 text-white overflow-auto">
      {/* User Header Component */}
      <UserHeader />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 max-w-7xl mx-auto">
        {/* Welcome Text */}
        <h1 className="text-3xl font-bold mb-4">Welcome to ArtistryX Administration</h1>
        <p className="text-gray-300">Manage and oversee the ArtistryX platform.</p>
      </div>
    </div>
  );
}
