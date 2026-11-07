const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function apiRequest(
  path,
  options = {},
  user
) {
  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-User-Id": user.uid,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed."
    );
  }

  return data;
}

export { API_URL };
