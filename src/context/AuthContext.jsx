import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, ApiError } from "../lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" = we're still checking a stored token before deciding
  // whether to show the login screen or the app.
  const [loading, setLoading] = useState(true);

  // On first mount: if a token is already in localStorage (from a previous
  // session), validate it against GET /admins/me instead of trusting it
  // blindly — it may have expired since the last visit.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/api/v1/admins/me")
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    // POST /api/v1/auth/login returns { user, access_token }.
    const { user: loggedInUser, access_token } = await api.post(
      "/api/v1/auth/login",
      { email, password },
      { auth: false }
    );
    setToken(access_token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // Lets Profile screens update the cached user after PATCH /admins/me etc.
  // without forcing a full re-fetch.
  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export { ApiError };
