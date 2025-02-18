"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserHeader from "@/components/UserHeader";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (!token) {
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
    <div className="h-screen fixed inset-0 bg-gradient-to-br from-gray-900 via-zinc-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* User Header Component */}
      <UserHeader />

      {/* Content - Updated margin-top */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 max-w-7xl mx-auto">
        <div className="w-full space-y-8 -mt-32"> {/* Changed from mt-16 to -mt-32 */}
          {/* Updated Welcome Header with new gradient */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold mb-4">
              <span className="text-white">Welcome to </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text animate-pulse">
                ArtistryX
              </span>
            </h1>
            <p className="text-xl text-gray-300">Your Creative Artist Management Hub</p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {/* Add Artist Card */}
            <div className="group hover:scale-105 transition-all duration-300 h-full">
              <Link href="/artist-operations?component=add" className="block h-full">
                <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all shadow-xl hover:shadow-white/20 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-xl">
                      <span className="text-3xl">👤</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Add Artist</h3>
                  </div>
                  <p className="text-gray-400 flex-grow">Add new artists with comprehensive profile management</p>
                </div>
              </Link>
            </div>

            {/* View Artists Card */}
            <div className="group hover:scale-105 transition-all duration-300 h-full">
              <Link href="/artist-operations?component=view" className="block h-full">
                <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all shadow-xl hover:shadow-white/20 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-xl">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">View Artists</h3>
                  </div>
                  <p className="text-gray-400 flex-grow">Browse and search through your artist database</p>
                </div>
              </Link>
            </div>

            {/* Update Artist Card */}
            <div className="group hover:scale-105 transition-all duration-300 h-full">
              <Link href="/artist-operations?component=update" className="block h-full">
                <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all shadow-xl hover:shadow-white/20 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-xl">
                      <span className="text-3xl">✏️</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Update Artist</h3>
                  </div>
                  <p className="text-gray-400 flex-grow">Modify and update artist information seamlessly</p>
                </div>
              </Link>
            </div>

            {/* Remove Artist Card */}
            <div className="group hover:scale-105 transition-all duration-300 h-full">
              <Link href="/artist-operations?component=remove" className="block h-full">
                <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all shadow-xl hover:shadow-white/20 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-xl">
                      <span className="text-3xl">🗑️</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Remove Artist</h3>
                  </div>
                  <p className="text-gray-400 flex-grow">Remove artists from your management system</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
