const API_URL = "http://localhost:8081/api/artists";

// ✅ Function to get Authorization headers (JWT)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ No token found");
    return { "Content-Type": "application/json" };
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


// ✅ Add a new artist
export async function addArtist(artist) {
  let response = await fetch("http://localhost:8081/api/artists", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(artist),
  });

  if (response.status === 401) {
    console.error("🔴 Token expired or invalid. Redirecting to login.");
    window.location.href = "/login"; // Redirect to login page
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add artist");
  }

  return response.json();
}



// ✅ Update an artist
export async function updateArtist(id, updatedArtist) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedArtist),
  });
  return response.json();
}

// ✅ Delete an artist
export async function deleteArtist(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  return response.json();
}

// ✅ Fetch all artists
export const fetchAllArtists = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    // Check if response status is 404 (No artists found)
    if (response.status === 404) {
      return [];
    }

    const responseText = await response.text();
    
    // Check for empty response
    if (!responseText || responseText.trim() === '') {
      return [];
    }

    try {
      const data = JSON.parse(responseText);

      // Check various response formats
      if (data && data.message === "Artist objects found successfully!!") {
        return data.artist || [];
      }

      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === "object") {
        const possibleArrays = ["data", "artists", "content", "items"];
        for (const key of possibleArrays) {
          if (Array.isArray(data[key])) {
            return data[key];
          }
        }
      }

      // If no valid data structure found, return empty array
      return [];

    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return [];
    }

  } catch (error) {
    console.error("Fetch Error:", error);
    return []; // Return empty array instead of throwing error
  }
};

// ✅ Find artists by industry
export const findArtistsByIndustry = async (industry) => {
  try {
    const response = await fetch(`${API_URL}/industry/${industry}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('No artists found in this industry');
    }

    try {
      const data = JSON.parse(responseText);

      // Handle various response formats
      if (data.artist) {
        return Array.isArray(data.artist) ? data.artist : [data.artist];
      }

      // If it's a success message with artist data
      if (data && data.message && data.message.includes("found successfully")) {
        const artistData = data.artist || data.data || data;
        if (Array.isArray(artistData)) {
          return artistData;
        }
        if (artistData && (artistData.artistId || artistData.id)) {
          return [artistData];
        }
      }

      // If it's an array
      if (Array.isArray(data)) {
        return data;
      }

      // If no artists found
      return [];

    } catch (parseError) {
      console.error("Parse Error:", parseError);
      throw new Error('No artists found in this industry');
    }

  } catch (error) {
    console.error("Find Artists By Industry Error:", error);
    throw new Error(error.message || 'No artists found in this industry');
  }
};

// ✅ Find artist by ID
export const findArtistById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Artist not found with this ID');
    }

    try {
      const data = JSON.parse(responseText);
      
      // Check if the response contains the artist object directly or nested
      if (data.artist) {
        return data.artist;
      }

      // If it's a direct artist object with required fields
      if (data && data.artistId) {
        return data;
      }

      // If it's a success message with artist data
      if (data && data.message && data.message.includes("found successfully")) {
        // Extract artist data from wherever it exists in the response
        const artistData = data.artist || data.data || data;
        if (artistData && (artistData.artistId || artistData.id)) {
          return artistData;
        }
      }

      throw new Error('Artist not found with this ID');

    } catch (parseError) {
      console.error("Parse Error:", parseError);
      throw new Error('Artist not found');
    }

  } catch (error) {
    console.error("Find Artist By ID Error:", error);
    throw new Error(error.message || 'Artist not found');
  }
};

// ✅ Find artist by name
export const findArtistByName = async (name) => {
  try {
    const response = await fetch(`${API_URL}/name/${name}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('No artists found with this name');
    }

    try {
      const data = JSON.parse(responseText);

      // Handle various response formats
      if (data.artist) {
        return Array.isArray(data.artist) ? data.artist : [data.artist];
      }

      // If it's a direct artist object
      if (data && data.artistId) {
        return [data];
      }

      // If it's a success message with artist data
      if (data && data.message && data.message.includes("found successfully")) {
        const artistData = data.artist || data.data || data;
        if (Array.isArray(artistData)) {
          return artistData;
        }
        if (artistData && (artistData.artistId || artistData.id)) {
          return [artistData];
        }
      }

      // If it's already an array
      if (Array.isArray(data)) {
        return data;
      }

      throw new Error('No artists found with this name');

    } catch (parseError) {
      console.error("Parse Error:", parseError);
      throw new Error('No artists found with this name');
    }

  } catch (error) {
    console.error("Find Artist By Name Error:", error);
    throw new Error(error.message || 'No artists found with this name');
  }
};