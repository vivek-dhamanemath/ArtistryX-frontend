"use client";
import Link from "next/link";
import UserHeader from "@/components/UserHeader";

export default function SubscriptionPage() {
  return (
    <div className="h-screen fixed inset-0 bg-gradient-to-br from-gray-900 via-zinc-900 to-black overflow-hidden">
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        /* Modern scrollbar styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(30, 30, 30, 0.2);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(168, 85, 247, 0.7), rgba(236, 72, 153, 0.7));
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(168, 85, 247, 0.9), rgba(236, 72, 153, 0.9));
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-400 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* User Header Component and Back Button */}
      <div className="flex justify-between items-center px-6 py-4 w-full relative z-20">
        <Link href="/" className="text-white flex items-center gap-2 backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg hover:bg-white/10 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <div className="flex items-center">
          <UserHeader />
        </div>
      </div>

      {/* Updated Welcome Header with new gradient */}
      <div className="relative z-10 flex flex-col items-center justify-start p-8 max-w-7xl mx-auto mt-0">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-4 text-center">
            <span className="text-white">Subscription Plans of </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text animate-pulse">
              ArtistryX
            </span>
          </h1>
          <p className="text-xl text-gray-300">Your Creative Artist Management Hub</p>
        </div>

        {/* Content */}
        <div className="w-full space-y-8">
          {/* Premium Options */}
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 w-full max-w-6xl px-4 mx-auto">
            {/* Free Plan */}
            <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-white/20 flex flex-col w-full md:w-1/3 relative overflow-hidden transform hover:-translate-y-1">
              <h2 className="text-3xl font-semibold mb-4 text-white">Free Plan</h2>
              <p className="text-2xl font-bold mb-4 text-white">$0 <span className="text-lg font-medium">/month</span></p>
              <p className="text-gray-400 mb-4">Perfect for beginners and small projects.</p>
              <ul className="text-gray-400 mb-4 list-disc list-inside space-y-2">
                <li>Manage up to 5 movies</li>
                <li>Add/Edit artists and directors</li>
                <li>View reviews and ratings</li>
                <li>Basic UI with limited features</li>
                <li>Limited data storage</li>
                <li>Community support forums</li>
              </ul>
              <Link href="/home" className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 hover:from-blue-500 hover:via-pink-500 hover:to-purple-400 text-white px-6 py-3 rounded-full mt-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                Get Started
              </Link>
            </div>
            
            {/* Professional Plan */}
            <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-white/20 flex flex-col w-full md:w-1/3 relative overflow-hidden transform hover:-translate-y-1">
              <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm py-1 px-12 shadow-lg">
                POPULAR
              </div>
              <h2 className="text-3xl font-semibold mb-4 text-white">Professional Plan</h2>
              <p className="text-2xl font-bold mb-4 text-white">$29 <span className="text-lg font-medium">/month</span></p>
              <p className="text-gray-400 mb-4">Perfect for growing businesses and professionals.</p>
              <ul className="text-gray-400 mb-4 list-disc list-inside space-y-2">
                <li>Unlimited movies, artists, and directors</li>
                <li>Advanced analytics on reviews</li>
                <li>Manage awards and nominations</li>
                <li>Priority customer support</li>
                <li>Customizable UI themes</li>
              </ul>
              <Link href="/payment?plan=professional&price=29" className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 hover:from-blue-500 hover:via-pink-500 hover:to-purple-400 text-white px-6 py-3 rounded-full mt-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                Get Started
              </Link>
            </div>
            {/* Enterprise Plan */}
            <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-white/20 flex flex-col w-full md:w-1/3 relative overflow-hidden transform hover:-translate-y-1">
              <h2 className="text-3xl font-semibold mb-4 text-white">Enterprise Plan</h2>
              <p className="text-2xl font-bold mb-4 text-white">$99 <span className="text-lg font-medium">/month</span></p>
              <p className="text-gray-400 mb-4">Perfect for large organizations and teams.</p>
              <ul className="text-gray-400 mb-4 list-disc list-inside space-y-2">
                <li>All Professional features</li>
                <li>Team collaboration tools</li>
                <li>API access for external integration</li>
                <li>Detailed financial reports</li>
                <li>Dedicated account manager</li>
              </ul>
              <Link href="/payment?plan=enterprise&price=99" className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 hover:from-blue-500 hover:via-pink-500 hover:to-purple-400 text-white px-6 py-3 rounded-full mt-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
