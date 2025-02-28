import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://artistryx-backend.onrender.com/api';
const API_URL = `${API_BASE_URL}/artists`;

// Get Authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : '',
    "Content-Type": "application/json",
  };
};

// Add a new artist
export const addArtist = async (artistData) => {
  try {
    const response = await axios.post(API_URL, artistData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error adding artist:', error);
    throw error.response?.data || error.message;
  }
};

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
    const response = await axios.get(`${API_URL}/industry/${industry}`, {
      headers: getAuthHeaders(),
    });
    return response.data.artist || [];
  } catch (error) {
    console.error("Find Artists By Industry Error:", error);
    return [];
  }
};

// Find artist by ID
export const findArtistById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.artist || null;
  } catch (error) {
    console.error("Find Artist By ID Error:", error);
    throw new Error('Artist not found');
  }
};

// Find artist by name
export const findArtistByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/name/${name}`, {
      headers: getAuthHeaders(),
    });
    return response.data.artist || [];
  } catch (error) {
    console.error("Find Artist By Name Error:", error);
    return [];
  }
};