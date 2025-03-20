const AUTH_API_URL = "http://localhost:8081/api/auth";

// ✅ User login
export async function loginUser(credentials) {
  console.log("🔹 Sending login request:", credentials);

  const response = await fetch(`${AUTH_API_URL}/login`, {
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

  const data = JSON.parse(responseText);
  
  // Store the token
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  // Always redirect to home page first
  let redirectTo = '/home'; // Changed to redirect to home page

  return { ...data, redirectTo };
}

// ✅ User registration
export async function registerUser(user) {
  try {
    console.log("Registering user:", user);
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.text();
    console.log("Register response:", response.status, data);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse error response:", data);
        throw new Error(`Registration failed with status ${response.status} and body: ${data}`);
      }
      console.error("Error data:", errorData); // Log the parsed error data
      throw new Error(errorData.message || `Registration failed with status ${response.status}`);
    }

    try {
      const parsedData = JSON.parse(data);
      console.log("Parsed registration data:", parsedData);
      return parsedData;
    } catch (e) {
      console.warn("Failed to parse JSON response, returning raw text:", data);
      return { success: true, message: "Registration successful (raw response)" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(`Registration failed: ${error.message}`);
  }
}

// Add a helper function to generate authorization headers if not already defined
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json"
  };
};

// ✅ Send reset code to email
export async function requestResetCode(email) {
  console.log("🔹 Sending reset request for:", email);

  const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  console.log("🔹 Response Status:", response.status);
  console.log("🔹 Response Headers:", response.headers);

  if (!response.ok) {
    const rawError = await response.text();
    // Clean up error message by removing curly braces, quotes, and the "error:" text
    const cleanMessage = rawError
      .replace(/[{}"]/g, '')
      .replace(/error:/i, '')
      .trim();
    console.error("❌ Backend Error:", cleanMessage || "Unknown error");
    throw new Error(cleanMessage || "Failed to send reset code.");
  }

  return response.json();
}

// ✅ Verify reset code
export async function verifyResetCode(email, token) {
  const response = await fetch(`${AUTH_API_URL}/verify-reset-code`, {
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
  const response = await fetch(`${AUTH_API_URL}/reset-password`, { // ✅ Correct endpoint
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
export async function checkUsernameAvailability(username) {
  try {
    const response = await fetch(`${AUTH_API_URL}/check-username/${encodeURIComponent(username)}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("checkUsernameAvailability response data:", data);
    // If backend returns an "exists" property true when username exists,
    // then username is available if exists is false.
    return data.exists === false;
  } catch (error) {
    console.error('Failed to fetch username availability:', error);
    throw error;
  }
}

// ✅ Live Email Availability Check
export const checkEmailAvailability = async (email) => {
  try {
    const url = `${AUTH_API_URL}/check-email/${encodeURIComponent(email)}`;
    console.log("Checking email with URL:", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", response.status, response.statusText, errorText);
      throw new Error(`Error checking email: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return {
      available: !data.exists,
      message: data.exists ? '❌ Email is already registered' : '✅ Email is available'
    };
  } catch (error) {
    console.error('Email check error:', error);
    return {
      available: false,
      message: `⚠️ Error checking email: ${error.message}`
    };
  }
};

export const googleLogin = async (credentials) => {
  try {
    console.log('Sending Google credentials to backend:', credentials);

    const response = await fetch(`${AUTH_API_URL}/google-login`, {
      method: 'POST',
      // Removed credentials option
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        credential: credentials.credential // Send the credential from Google login
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


