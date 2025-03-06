import { useState, useEffect } from "react";
import { addArtist, fetchAllArtists, deleteArtist, updateArtist } from "@/services/artistService";

export default function ArtistOperations() {
  const [artists, setArtists] = useState([]);
  const [artist, setArtist] = useState({
    name: "",
    industry: "",
    email: "",
    bio: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load artists on component mount
  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const data = await fetchAllArtists();
      setArtists(data);
    } catch (error) {
      setError("Failed to load artists");
    }
  };

  const handleChange = (e) => {
    setArtist({ ...artist, [e.target.name]: e.target.value });
  };

  const handleAddArtist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!artist.name || !artist.industry || !artist.email) {
        throw new Error("Name, Industry, and Email are required");
      }

      const response = await addArtist(artist);
      setMessage("✅ Artist added successfully!");
      setArtist({ name: "", industry: "", email: "", bio: "" }); // Clear form
      await loadArtists(); // Reload the artists list
    } catch (error) {
      setError(error.message || "Failed to add artist");
      console.error("Add artist error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArtist = async (id) => {
    try {
      await updateArtist(id, artist);
      setMessage("✅ Artist updated successfully!");
      setArtist({ name: "", industry: "", email: "", bio: "" });
      await loadArtists();
    } catch (error) {
      setError("Failed to update artist");
    }
  };

  const handleRemoveArtist = async (id) => {
    try {
      await deleteArtist(id);
      setMessage("✅ Artist removed successfully!");
      await loadArtists();
    } catch (error) {
      setError("Failed to remove artist");
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(artists);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "artists.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">🎨 Artist Operations</h1>

        <form onSubmit={handleAddArtist} className="space-y-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Artist Name *"
            value={artist.name}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:border-blue-500 focus:ring-1"
            required
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry *"
            value={artist.industry}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:border-blue-500 focus:ring-1"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={artist.email}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:border-blue-500 focus:ring-1"
            required
          />
          <textarea
            name="bio"
            placeholder="Bio"
            value={artist.bio}
            onChange={handleChange}
            className="border p-2 rounded w-full focus:border-blue-500 focus:ring-1"
            rows="3"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded text-white font-medium ${
              loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Adding Artist...' : 'Add Artist'}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            ❌ {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Artists List</h2>
          {artists.length > 0 ? (
            <div className="space-y-4">
              {artists.map((a) => (
                <div key={a._id} className="border p-4 rounded-lg hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{a.name}</h3>
                      <p className="text-gray-600">Industry: {a.industry}</p>
                      <p className="text-gray-600">Email: {a.email}</p>
                      {a.bio && <p className="text-gray-600 mt-2">{a.bio}</p>}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleUpdateArtist(a._id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveArtist(a._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No artists found</p>
          )}
        </div>
      </div>
    </div>
  );
}
