"use client";
import { useState, useEffect } from "react";
import { deleteArtist, fetchAllArtists } from "@/services/artistService";

export default function DeleteArtist() {
  const [artistId, setArtistId] = useState("");
  const [message, setMessage] = useState("");
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all artists when component mounts
  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const response = await fetchAllArtists();
      setArtists(response);
      setLoading(false);
    } catch (error) {
      setMessage("Failed to load artists");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setMessage("Please enter an Artist ID");
      return;
    }

    try {
      await deleteArtist(id);
      setMessage("✅ Artist deleted successfully!");
      setArtistId("");
      // Refresh the artists list
      loadArtists();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main content with side panel layout */}
      <div className="flex gap-6 h-full">
        {/* Left Search Panel */}
        <div className="w-80 flex-shrink-0">
          <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl border border-white/10 sticky top-0">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-white mb-1">Remove Artist</h2>
              <p className="text-sm text-gray-400">Enter Artist ID to remove</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Artist ID</label>
                <input
                  type="text"
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all hover:bg-white/10 backdrop-blur-sm"
                  placeholder="Enter Artist ID"
                />
              </div>

              <button
                onClick={() => handleDelete(artistId)}
                className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium"
              >
                Delete Artist
              </button>

              {message && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm animate-fadeIn">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 min-h-0">
          {artists.length > 0 && (
            <div className="flex flex-col h-full rounded-xl backdrop-blur-lg bg-white/5 border border-white/10">
              {/* Results Header */}
              <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md px-6 py-4 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Available Artists</h3>
                      <p className="text-sm text-gray-400">{artists.length} artists found</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10">Age</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10">Gender</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10">Nationality</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10">Industry</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-white/10">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {artists.map((artist) => (
                      <tr 
                        key={artist.artistId}
                        className="hover:bg-white/5 transition-all duration-200 backdrop-blur-sm group"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors">{artist.artistId}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
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
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDelete(artist.artistId)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
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
