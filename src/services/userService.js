// filepath: /d:/ArtistryX project Deployed/Frontend-Nextjs/film-management-frontend/src/services/userService.js
const API_AUTH_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

export async function registerUser(user) {
  const response = await fetch(`${API_AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("❌ Server error. Please try again.");
  }

  try {
    return await response.json();
  } catch (error) {
    return { message: "✅ Registration successful, but no response from server." };
  }
}