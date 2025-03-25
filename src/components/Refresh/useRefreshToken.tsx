import { useState } from "react";

export function useRefreshToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://social-backend-kzy5.onrender.com/auth/refresh", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      });

      if (!response.ok) throw new Error("Tokenni yangilash muvaffaqiyatsiz!");

      const data = await response.json();
      localStorage.setItem("access_token", data.accessToken); 
      return data.accessToken;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { refreshToken, loading, error };
}
