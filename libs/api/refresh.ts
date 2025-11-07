import { BASE_URL } from "@/shared/constants/endpoints";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const REFRESH_URL = `${BASE_URL}/auth/refresh`;

let refreshPromise: Promise<string | null> | null = null;

// 56dporfjcd6v

export async function refreshAccessToken(
  token?: string
): Promise<string | null> {
  const { session: currentSession, setAuthData } = useAuthStore.getState();
  if (!currentSession?.refresh) return null;

  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await axios.post(REFRESH_URL, {
        token: currentSession.refresh || token,
      });

      const { session, profile } = res.data.data;
      console.log("Session", session);

      setAuthData({
        profile,
        session,
      });

      return session.token;
    } catch (err) {
      console.log("Error", err);
      setAuthData({
        profile: null,
        session: null,
      });
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
