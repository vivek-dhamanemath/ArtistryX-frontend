import axios from 'axios';

const API_URL = 'http://localhost:8081/api/artists';  // Updated URL

// Get Authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : '',
    "Content-Type": "application/json",
  };
};

// Add a new artist
export async function addArtist(artist) {
  try {
    const response = await fetch(API_URL, {  // Removed extra "/artists"
      method: "POST",
      headers: getAuthHeaders(),  // Use authentication headers
      body: JSON.stringify(artist),
    });
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};  // Handle empty response text
    if (!response.ok) {
      throw new Error(data.message || `Failed to add artist. Status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("addArtist error:", error);
    throw error;
  }
}

// Update an artist
export const updateArtist = async (id, updatedArtist) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedArtist, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete an artist
export const deleteArtist = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch all artists
export const fetchAllArtists = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data.artist || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// Find artists by industry
export const findArtistsByIndustry = async (industry) => {
  try {
    const lowerIndustry = industry.toLowerCase(); // case-insensitive search
    const response = await axios.get(`${API_URL}/industry/${lowerIndustry}`, {
      headers: getAuthHeaders(),
      validateStatus: () => true, // Allow all statuses for manual check
    });

    console.log("Response:", response); // Log the response

    if (response.status === 200) {
      // Ensure this matches the backend response structure
      return response.data.data || []; // Use response.data.data to access the list of artists
    }
    throw new Error("No artists found for the provided industry.");
  } catch (error) {
    console.error("Find Artists By Industry Error:", error);
    throw new Error(`Error finding artists by industry: ${error.message}`);
  }
};

// Find artist by ID
export const findArtistById = async (id) => {
  try {
    if (!id) {
      throw new Error("Artist ID is required");
    }
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
      validateStatus: () => true, // Allow all statuses for manual check
    });
    // Allow both 2xx and 302 as success codes
    if ((response.status >= 200 && response.status < 300) || response.status === 302) {
      return response.data;
    }
    // Return a simple message when not found
    throw new Error("Artist not found.");
  } catch (error) { 
    console.error("Find Artist By ID Error:", error);
    throw new Error("Artist not found.");
  }
};

// Find artist by name
export const findArtistByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/name/${name}`, {
      headers: getAuthHeaders(),
      validateStatus: () => true, // Allow all statuses for manual check
    });
    // Allow both success (2xx) and 302 responses as valid
    if ((response.status >= 200 && response.status < 300) || response.status === 302) {
      return response.data || [];
    }
    throw new Error("Artist not found.");
  } catch (error) {
    console.error("Find Artist By Name Error:", error);
    throw new Error(`Error finding artist by name: ${error.message}`);
  }
};
