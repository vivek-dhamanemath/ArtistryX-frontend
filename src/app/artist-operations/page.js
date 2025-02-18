"use client";
import { useState, useEffect } from "react";
import AddArtist from "@/components/ArtistForm";
import UpdateArtist from "@/components/UpdateArtistForm";
import RemoveArtist from "@/components/DeleteArtist";
import FindArtists from "@/components/FindArtists";
import ArtistList from "@/components/ArtistList";
import UserHeader from "@/components/UserHeader";
import Link from "next/link";

export default function ArtistOperationsPage() {
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const component = urlParams.get("component");
    if (component) {
      setActiveComponent(component);
    }
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case "add":
        return <AddArtist />;
      case "view":
        return <FindArtists />;
      case "update":
        return <UpdateArtist />;
      case "remove":
        return <RemoveArtist />;
      case "list":
        return <ArtistList />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen fixed inset-0 flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-zinc-900 to-black text-white">
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
          <span>Back to Home</span>
        </Link>
      </div>
      
      <div className="w-full max-w-6xl mx-auto p-6 mt-20">
        <div className="backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl h-[calc(100vh-140px)] relative">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}
