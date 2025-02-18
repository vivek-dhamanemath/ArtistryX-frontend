"use client";
import { useEffect, useState } from "react";
import { fetchAllArtists } from "@/services/artistService";

export default function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true);
        const response = await fetchAllArtists();
        console.log("API Response:", response); // Debug log

        // Fixed syntax: added missing parenthesis
        if (Array.isArray(response)) {
          setArtists(response);
          setError(null);
        } else if (response && typeof response === 'object' && response.data) {
          setArtists(response.data);
          setError(null);
        } else {
          setArtists([]);
          setError("No artists found");
        }
      } catch (error) {
        console.error("Error loading artists:", error);
        setError("Failed to load artists");
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">Loading artists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full backdrop-blur-lg bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">All Artists</h2>
      
      {artists.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-400">No artists found in the database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nationality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Industry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {artists.map((artist) => (
                <tr 
                  key={artist.artistId}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.artistId}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.artistName}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.age}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.nationality}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{artist.industry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}