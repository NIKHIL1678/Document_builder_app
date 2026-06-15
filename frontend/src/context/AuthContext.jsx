import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// HELPER UTILITIES (Keeping the logic clean)
const getToken = () => localStorage.getItem("accessToken");
const setToken = (token) => localStorage.setItem("accessToken", token);
const clearStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = getToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // CALLING BACKEND: Verify token and get fresh user data
        const response = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Session expired");

        const result = await response.json();
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
      } catch (error) {
        console.error("Session restoration failed:", error.message);
        logout();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = (token, nextUser) => {
    setToken(token);
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    // Optional: Call backend to clear the Refresh Token cookie
    
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}