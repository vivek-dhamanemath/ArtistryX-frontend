const API_URL = "http://localhost:8081/api/auth";

// ✅ User login
export async function loginUser(credentials) {
  console.log("🔹 Sending login request:", credentials);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const responseText = await response.text();
  console.log("🔹 Response Status:", response.status);
  console.log("🔹 Response Body:", responseText);

  if (!response.ok) {
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid credentials.");
    }
    throw new Error(errorData.error || "❌ Invalid credentials.");
  }

  return JSON.parse(responseText);
}

// ✅ User registration
export async function registerUser(user) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.text();
    
    if (!response.ok) {
      // Try to parse error message
      try {
        const errorData = JSON.parse(data);
        throw new Error(errorData.message || "Registration failed");
      } catch {
        // If can't parse JSON, use raw text
        throw new Error(data || "Registration failed");
      }
    }

    try {
      return JSON.parse(data);
    } catch {
      return { success: true, message: "Registration successful" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(error.message);
  }
}


const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  ...(localStorage.getItem("token") && { 
    Authorization: `Bearer ${localStorage.getItem("token")}` 
  })
});

// ✅ Send reset code to email
export async function requestResetCode(email) {
  console.log("🔹 Sending reset request for:", email); // Debugging

  const response = await fetch("http://localhost:8081/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  console.log("🔹 Response Status:", response.status); // Log status
  console.log("🔹 Response Headers:", response.headers); // Log headers

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("❌ Backend Error:", errorMessage || "Unknown error"); // Debugging
    throw new Error(errorMessage || "Failed to send reset code.");
  }

  return response.json();
}

// ✅ Verify reset code
export async function verifyResetCode(email, token) {
  const response = await fetch(`${API_URL}/verify-reset-code`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, token }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("❌ Backend Error:", errorMessage); 
    throw new Error(errorMessage || "Failed to verify reset code.");
  }

  return response.json();
}

// ✅ Update password
export async function updatePassword(email, newPassword) {
  const response = await fetch(`${API_URL}/reset-password`, { // ✅ Correct endpoint
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("❌ Backend Error:", errorMessage || "Unknown error");
    throw new Error(errorMessage || "Failed to update password.");
  }

  return response.json();
}

// ✅ Live Username Availability Check
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await fetch(`${API_URL}/check-username?username=${username}`, {
      method: 'GET',
      credentials: "include",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return {
        available: false,
        message: 'Username already taken'
      };
    }

    return {
      available: true,
      message: '✅ Username is available'
    };
  } catch (error) {
    console.error('Username check error:', error);
    return {
      available: false,
      message: '⚠️ Error checking username availability'
    };
  }
};

// ✅ Live Email Availability Check
export const checkEmailAvailability = async (email) => {
  try {
    const response = await fetch(`${API_URL}/check-email?email=${encodeURIComponent(email)}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      return {
        available: false,
        message: "Email already registered.", // Cleaned up message
      };
    }

    const data = await response.json();
    return {
      available: true,
      message: data.message || "Email is available",
    };
  } catch (error) {
    console.error("Email check error:", error);
    return {
      available: false,
      message: "Error checking email availability",
    };
  }
};

export const googleLogin = async (credentials) => {
  try {
    console.log('Sending Google credentials to backend:', credentials);

    const response = await fetch(`${API_URL}/google-login`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        credential: credentials.credential // ✅ Send credential properly
      })
    });

    const rawResponse = await response.text();
    console.log('Raw Backend Response:', rawResponse);

    if (!response.ok) {
      throw new Error(rawResponse || 'Failed to authenticate with Google');
    }

    return JSON.parse(rawResponse);
  } catch (error) {
    console.error('Google Login Error:', error);
    throw error;
  }
};


