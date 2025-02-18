"use client";
import { useState } from "react";
import { updateArtist } from "@/services/artistService";
import CustomSelect from "@/components/CustomSelect";

export default function UpdateArtistForm({ onArtistUpdated = () => {} }) {
  const [artist, setArtist] = useState({
    artistId: "",
    artistName: "",
    gender: "",
    age: "",
    nationality: "",
    industry: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const industries = [
    "Bollywood (Hindi)",
    "Tollywood (Telugu)",
    "Kollywood (Tamil)",
    "Mollywood (Malayalam)",
    "Sandalwood (Kannada)",
    "Bengali Film Industry (Bengali)",
    "Marathi Film Industry (Marathi)",
    "Punjabi Film Industry (Punjabi)",
    "Odia Film Industry (Odia)",
    "Bhojpuri Film Industry (Bhojpuri)",
  ];

  const nationalities = [
    { name: "American 🇺🇸", value: "American" },
    { name: "Argentinian 🇦🇷", value: "Argentinian" },
    { name: "Australian 🇦🇺", value: "Australian" },
    { name: "Austrian 🇦🇹", value: "Austrian" },
    { name: "Bangladeshi 🇧🇩", value: "Bangladeshi" },
    { name: "Brazilian 🇧🇷", value: "Brazilian" },
    { name: "British 🇬🇧", value: "British" },
    { name: "Canadian 🇨🇦", value: "Canadian" },
    { name: "Chilean 🇨🇱", value: "Chilean" },
    { name: "Chinese 🇨🇳", value: "Chinese" },
    { name: "Colombian 🇨🇴", value: "Colombian" },
    { name: "Czech 🇨🇿", value: "Czech" },
    { name: "Danish 🇩🇰", value: "Danish" },
    { name: "Dutch 🇳🇱", value: "Dutch" },
    { name: "Egyptian 🇪🇬", value: "Egyptian" },
    { name: "Filipino 🇵🇭", value: "Filipino" },
    { name: "Finnish 🇫🇮", value: "Finnish" },
    { name: "French 🇫🇷", value: "French" },
    { name: "German 🇩🇪", value: "German" },
    { name: "Greek 🇬🇷", value: "Greek" },
    { name: "Hungarian 🇭🇺", value: "Hungarian" },
    { name: "Indian 🇮🇳", value: "Indian" },
    { name: "Indonesian 🇮🇩", value: "Indonesian" },
    { name: "Irish 🇮🇪", value: "Irish" },
    { name: "Israeli 🇮🇱", value: "Israeli" },
    { name: "Italian 🇮🇹", value: "Italian" },
    { name: "Japanese 🇯🇵", value: "Japanese" },
    { name: "Malaysian 🇲🇾", value: "Malaysian" },
    { name: "Mexican 🇲🇽", value: "Mexican" },
    { name: "New Zealander 🇳🇿", value: "New Zealander" },
    { name: "Nigerian 🇳🇬", value: "Nigerian" },
    { name: "Norwegian 🇳🇴", value: "Norwegian" },
    { name: "Pakistani 🇵🇰", value: "Pakistani" },
    { name: "Peruvian 🇵🇪", value: "Peruvian" },
    { name: "Polish 🇵🇱", value: "Polish" },
    { name: "Portuguese 🇵🇹", value: "Portuguese" },
    { name: "Romanian 🇷🇴", value: "Romanian" },
    { name: "Russian 🇷🇺", value: "Russian" },
    { name: "Saudi Arabian 🇸🇦", value: "Saudi Arabian" },
    { name: "Singaporean 🇸🇬", value: "Singaporean" },
    { name: "South African 🇿🇦", value: "South African" },
    { name: "South Korean 🇰🇷", value: "South Korean" },
    { name: "Spanish 🇪🇸", value: "Spanish" },
    { name: "Swedish 🇸🇪", value: "Swedish" },
    { name: "Swiss 🇨🇭", value: "Swiss" },
    { name: "Thai 🇹🇭", value: "Thai" },
    { name: "Turkish 🇹🇷", value: "Turkish" },
    { name: "Ukrainian 🇺🇦", value: "Ukrainian" },
    { name: "Vietnamese 🇻🇳", value: "Vietnamese" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "artistName" && !/^[A-Za-z ]*$/.test(value)) return; // ✅ Name validation
    if (name === "artistId" && !/^\d*$/.test(value)) return; // ✅ ID validation
    
    setArtist({ ...artist, [name]: value });
  };

  const handleNationalityChange = (selected) => {
    setArtist({ ...artist, nationality: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateArtist(artist.artistId, artist);
      setMessage(`✅ ${response.message || "Artist updated successfully!"}`);
      setMessageType("success");

      setArtist({ artistId: "", artistName: "", gender: "", age: "", nationality: "", industry: "" });
      onArtistUpdated();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to update artist. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto"> {/* Removed overflow-y-auto */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">Update Artist</h2>
        <p className="text-sm text-gray-400">Modify existing artist information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Artist ID Search Field */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Artist ID</label>
          <input
            type="text"
            name="artistId"
            value={artist.artistId}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
            placeholder="Enter artist ID"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Artist Name Field */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Artist Name</label>
            <input
              type="text"
              name="artistName"
              value={artist.artistName}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
              placeholder="Enter artist name"
              required
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={artist.age}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
              placeholder="Enter age"
              required
            />
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
            <select
              name="gender"
              value={artist.gender}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
              required
            >
              <option value="" className="bg-gray-900">Select gender</option>
              <option value="Male" className="bg-gray-900 text-white">Male</option>
              <option value="Female" className="bg-gray-900 text-white">Female</option>
              <option value="Other" className="bg-gray-900 text-white">Other</option>
            </select>
          </div>

          {/* Nationality Field with contained scroll */}
          <div>
            <CustomSelect
              label="Nationality"
              options={nationalities}
              value={artist.nationality}
              onChange={handleNationalityChange}
              placeholder="Select nationality"
            />
          </div>

          {/* Industry Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
            <select
              name="industry"
              value={artist.industry}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
              required
            >
              <option value="" className="bg-gray-900">Select industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind} className="bg-gray-900 text-white">
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Update Artist
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center backdrop-blur-sm animate-fadeIn
            ${messageType === 'success' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
