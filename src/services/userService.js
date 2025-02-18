const API_URL = "http://localhost:8081/api/users";

export async function registerUser(user) {
  const response = await fetch("http://localhost:8081/api/users/register", {
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

