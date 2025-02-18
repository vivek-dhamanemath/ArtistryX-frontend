"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findArtistById, findArtistByName, findArtistsByIndustry, fetchAllArtists } from "@/services/artistService";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";

export default function FindArtists() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    setMessage("");
    setArtists([]); // Clear previous results
    
    try {
      let response;
      switch (searchType) {
        case "all":
          response = await fetchAllArtists();
          console.log("Raw API response:", response); // Debug log
          
          // Check if response has the data property
          if (response && response.data) {
            const artistData = response.data;
            if (artistData.length > 0) {
              setArtists(artistData);
              return;
            }
          }
          
          if (!response || (Array.isArray(response) && response.length === 0)) {
            setMessage("No artists found in the database. Add some artists to get started!");
            return;
          }
          
          // If response is direct array
          if (Array.isArray(response) && response.length > 0) {
            setArtists(response);
            return;
          }
          break;
        case "id":
          try {
            response = await findArtistById(searchTerm);
            if (response) {
              // Always convert response to array for table display
              setArtists(Array.isArray(response) ? response : [response]);
            } else {
              setMessage("Artist not found with this ID");
            }
            return;
          } catch (error) {
            setMessage(error.message || "Artist not found");
            return;
          }
        case "name":
          response = await findArtistByName(searchTerm);
          response = Array.isArray(response) ? response : [response];
          break;
        case "industry":
          response = await findArtistsByIndustry(searchTerm);
          break;
        default:
          throw new Error("Invalid search type");
      }

      if (!response || (Array.isArray(response) && response.length === 0)) {
        setMessage("No artists found matching your search criteria.");
        return;
      }

      setArtists(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error("Search error details:", error);
      setMessage(error.message || "Failed to fetch artists");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Section with Side Panel */}
      <div className="flex gap-6 h-full">
        {/* Left Search Panel */}
        <div className="w-80 flex-shrink-0">
          <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl border border-white/10 sticky top-0">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white mb-1">Find Artists</h2>
              <p className="text-sm text-gray-400">Search using different criteria</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all hover:bg-white/10 backdrop-blur-sm"
                >
                  <option value="all" className="bg-gray-900">Find All Artists</option>
                  <option value="id" className="bg-gray-900">Find by Artist ID</option>
                  <option value="name" className="bg-gray-900">Find by Artist Name</option>
                  <option value="industry" className="bg-gray-900">Find by Industry</option>
                </select>
              </div>

              {searchType !== "all" && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {searchType === "id" ? "Artist ID" : searchType === "name" ? "Artist Name" : "Industry"}
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all hover:bg-white/10 backdrop-blur-sm"
                    placeholder={`Enter ${searchType === "id" ? "artist ID" : searchType === "name" ? "artist name" : "industry"}`}
                  />
                </div>
              )}

              <button
                onClick={handleSearch}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium"
              >
                {searchType === "all" ? "View All Artists" : "Search"}
              </button>

              {/* Message Display */}
              {message && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm animate-fadeIn">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 min-h-0 flex flex-col">
          {artists.length > 0 && (
            <div className="flex flex-col h-full rounded-xl backdrop-blur-lg bg-white/5 border border-white/10">
              {/* Sticky Results Header */}
              <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md px-6 py-4 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Search Results</h3>
                      <p className="text-sm text-gray-400">{artists.length} artists found</p>
                    </div>
                  </div>
                  
                  {/* Export Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => exportToPDF(artists)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export PDF
                    </button>
                    
                    <button
                      onClick={() => exportToExcel(artists)}
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full">
                  {/* Sticky Table Header */}
                  <thead className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 bg-gray-900/95">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 bg-gray-900/95">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 bg-gray-900/95">Age</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 bg-gray-900/95">Gender</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 bg-gray-900/95">Nationality</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10 bg-gray-900/95">Industry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {artists.map((artist, index) => (
                      <tr 
                        key={artist.artistId || index}
                        className="hover:bg-white/5 transition-all duration-200 backdrop-blur-sm group"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors">{artist.artistId}</td>
                        {/* Simplified name cell without initial circle */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                            {artist.artistName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors">{artist.age}</td>
                        <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors">{artist.gender}</td>
                        <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors">{artist.nationality}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            {artist.industry}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
