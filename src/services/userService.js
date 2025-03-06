const API_AUTH_URL = "https://artistryx-backend.onrender.com/api/auth";

export async function registerUser(user) {
  const response = await fetch(`${API_AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "❌ Server error. Please try again.");
  }

  try {
    return await response.json();
  } catch (error) {
    return { message: "✅ Registration successful, but no response from server." };
  }
}

export async function checkUsernameAvailability(username) {
  const response = await fetch(`${API_AUTH_URL}/check-username/${username}`);
  return await response.json();
}

export async function checkEmailAvailability(email) {
  const response = await fetch(`${API_AUTH_URL}/check-email/${email}`);
  return await response.json();
}