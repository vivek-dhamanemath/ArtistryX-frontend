import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArtistOperations() {
  const router = useRouter();
  const [artists, setArtists] = useState([]);
  const [artist, setArtist] = useState({ name: "", age: "", gender: "", industry: "", nationality: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setArtist({ ...artist, [e.target.name]: e.target.value });
  };

  const handleAddArtist = () => {
    setArtists([...artists, artist]);
    setArtist({ artistName: "", age: "", gender: "", nationality: "", industry: "" });
    setMessage("✅ Artist added successfully!");
  };

  const handleUpdateArtist = (index) => {
    const updatedArtists = artists.map((a, i) => (i === index ? artist : a));
    setArtists(updatedArtists);
    setArtist({ artistName: "", age: "", gender: "", nationality: "", industry: "" });
    setMessage("✅ Artist updated successfully!");
  };

  const handleRemoveArtist = (index) => {
    const updatedArtists = artists.filter((_, i) => i !== index);
    setArtists(updatedArtists);
    setMessage("✅ Artist removed successfully!");
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

  const handleUpgrade = () => {
    router.push('/subscription-plans');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">🎨 Artist Operations</h1>

        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={artist.name}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            name="age"
            placeholder="Age"
            value={artist.age}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={artist.gender}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            name="industry"
            placeholder="Industry"
            value={artist.industry}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={artist.nationality}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleAddArtist}
            className="w-full bg-green-500 text-white p-2 rounded mb-2"
          >
            Add Artist
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Artists"
            onChange={handleSearch}
            className="border p-2 rounded w-full mb-2"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={handleExportData}
            className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          >
            Export Data
          </button>
        </div>

        {/* Add Upgrade to Premium Button */}
        <div className="mt-6 border-t pt-6">
          <button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transform transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span className="text-xl">⭐</span>
            Upgrade to Premium
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">
            Get unlimited artists and advanced features
          </p>
        </div>

        {message && <p className="mt-4 text-center">{message}</p>}

        <ul className="list-disc list-inside mt-4">
          {artists.map((artist, index) => (
            <li key={index} className="mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Name:</strong> {artist.name}</p>
                  <p><strong>Age:</strong> {artist.age}</p>
                  <p><strong>Gender:</strong> {artist.gender}</p>
                  <p><strong>Industry:</strong> {artist.industry}</p>
                  <p><strong>Nationality:</strong> {artist.nationality}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleUpdateArtist(index)}
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleRemoveArtist(index)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
