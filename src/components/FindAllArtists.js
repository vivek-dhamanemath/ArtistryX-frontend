import { useEffect, useState } from "react";
import { fetchAllArtists } from "@/services/artistService";

export default function FindAllArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const data = await fetchAllArtists();
      console.log("✅ Artists Data:", data); // 🔍 Debugging
      setArtists(data);
    } catch (error) {
      console.error("❌ Failed to fetch artists:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">📋 All Artists</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : artists.length === 0 ? (
        <p className="text-center text-gray-500">No artists found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Gender</th>
                <th className="border px-4 py-2">Age</th>
                <th className="border px-4 py-2">Nationality</th>
                <th className="border px-4 py-2">Industry</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{artist.id || artist.artistId}</td>
                  <td className="border px-4 py-2">{artist.name || artist.artistName}</td>
                  <td className="border px-4 py-2">{artist.gender}</td>
                  <td className="border px-4 py-2">{artist.age}</td>
                  <td className="border px-4 py-2">{artist.nationality}</td>
                  <td className="border px-4 py-2">{artist.industry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
