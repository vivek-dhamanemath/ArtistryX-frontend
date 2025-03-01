const API_URL = "https://artistryx-backend.onrender.com/api/users";

export async function registerUser(user) {
  const response = await fetch("https://artistryx-backend.onrender.com/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("❌ Server error. Please try again.");
  }

  try {
    return await response.json(); // ✅ Prevents parsing empty response
  } catch (error) {
    return { message: "✅ Registration successful, but no response from server." };
  }
}

