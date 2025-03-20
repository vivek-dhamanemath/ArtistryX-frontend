"use client";
import { useState } from "react";
import { addArtist } from "@/services/artistService";
import CustomSelect from "@/components/CustomSelect";

export default function AddArtist() {
  const [artist, setArtist] = useState({
    artistName: "", // Change from 'name' to 'artistName' to match backend
    age: "",
    gender: "",
    nationality: "",
    industry: ""
  });
  const [errorMessage, setErrorMessage] = useState(""); // Add errorMessage state
  const [successMessage, setSuccessMessage] = useState(""); // Add successMessage state

  const industries = [
    { name: "Bollywood (Hindi)", value: "Bollywood" },
    { name: "Tollywood (Telugu)", value: "Tollywood" },
    { name: "Kollywood (Tamil)", value: "Kollywood" },
    { name: "Mollywood (Malayalam)", value: "Mollywood" },
    { name: "Sandalwood (Kannada)", value: "Sandalwood" },
    { name: "Bengali Film Industry", value: "Bengali" },
    { name: "Marathi Film Industry", value: "Marathi" },
    { name: "Punjabi Film Industry", value: "Punjabi" },
    { name: "Odia Film Industry", value: "Odia" },
    { name: "Bhojpuri Film Industry", value: "Bhojpuri" }
  ];

  const nationalities = [
    { name: "American 🇺🇸", value: "American" },
    { name: "Argentinian 🇦�", value: "Argentinian" },
    { name: "Australian 🇦🇺", value: "Australian" },
    { name: "Austrian 🇦🇹", value: "Austrian" },
    { name: "Bangladeshi 🇧🇩", value: "Bangladeshi" },
    { name: "Brazilian 🇧🇷", value: "Brazilian" },
    { name: "British 🇬🇧", value: "British" },
    { name: "Canadian 🇨🇦", value: "Canadian" },
    { name: "Chilean 🇨🇱", value: "Chilean" },
    { name: "Chinese 🇨🇳", value: "Chinese" },
    { name: "Colombian 🇨�", value: "Colombian" },
    { name: "Czech 🇨🇿", value: "Czech" },
    { name: "Danish 🇩🇰", value: "Danish" },
    { name: "Dutch 🇳🇱", value: "Dutch" },
    { name: "Egyptian 🇪�g", value: "Egyptian" },
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
    { name: "Nigerian 🇳�", value: "Nigerian" },
    { name: "Norwegian 🇳�", value: "Norwegian" },
    { name: "Pakistani 🇵🇰", value: "Pakistani" },
    { name: "Peruvian 🇵�", value: "Peruvian" },
    { name: "Polish 🇵🇱", value: "Polish" },
    { name: "Portuguese 🇵�", value: "Portuguese" },
    { name: "Romanian 🇷🇴", value: "Romanian" },
    { name: "Russian 🇷🇺", value: "Russian" },
    { name: "Saudi Arabian 🇸🇦", value: "Saudi Arabian" },
    { name: "Singaporean 🇸�", value: "Singaporean" },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting artist data:", artist);
      await addArtist(artist);
      console.log("Artist added successfully");
      clearForm();
      setSuccessMessage("Artist added successfully!");
      setErrorMessage("");
      //loadArtists(); // Ensure loadArtists is defined or remove if not needed
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setErrorMessage(error.message || "An error occurred");
      setSuccessMessage("");
    }
  };

  // Update clearForm function too
  const clearForm = () => {
    setArtist({
      artistName: "",
      age: "",
      gender: "",
      nationality: "",
      industry: ""
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Add new handler for nationality
  const handleNationalityChange = (selected) => {
    setArtist({ ...artist, nationality: selected });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">Add New Artist</h2>
        <p className="text-sm text-gray-400">Enter the artist's information below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Artist Name Field */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
          <input
            type="text"
            name="artistName"
            value={artist.artistName}
            onChange={(e) => setArtist({ ...artist, artistName: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
            placeholder="Enter artist name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Age Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={artist.age}
              onChange={(e) => setArtist({ ...artist, age: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
              placeholder="Enter age"
              required
            />
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
            <select
              name="gender"
              value={artist.gender}
              onChange={(e) => setArtist({ ...artist, gender: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
              required
            >
              <option value="" className="bg-gray-900">Select gender</option>
              <option value="Male" className="bg-gray-900 text-white">Male</option>
              <option value="Female" className="bg-gray-900 text-white">Female</option>
              <option value="Other" className="bg-gray-900 text-white">Other</option>
            </select>
          </div>

          {/* Nationality Field */}
          <div className="relative inline-block w-full">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
            <select
              name="industry"
              value={artist.industry}
              onChange={(e) => setArtist({ ...artist, industry: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
              required
            >
              <option value="" className="bg-gray-900">Select industry</option>
              {industries.map((ind) => (
                <option 
                  key={ind.value} 
                  value={ind.value}
                  className="bg-gray-900 text-white"
                >
                  {ind.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={clearForm}
            className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all transform hover:-translate-y-0.5 border border-white/10 backdrop-blur-sm"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Artist
          </button>
        </div>

        {/* Message Display */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-lg text-center backdrop-blur-sm animate-fadeIn bg-red-500/10 text-red-400 border border-red-500/20">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-6 p-4 rounded-lg text-center backdrop-blur-sm animate-fadeIn bg-green-500/10 text-green-400 border border-green-500/20">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
