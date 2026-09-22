import React, { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // =========================================================
  // SYNCHRONOUS USER HYDRATION
  // Reads localStorage BEFORE first render so child components
  // see the logged-in user immediately — no flicker.
  // =========================================================
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.warn("Failed to parse stored user:", err);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // =========================================================
  // WRAPPED setUser — persists to localStorage on every update
  // =========================================================
  const updateUser = useCallback((updater) => {
    setUser((prev) => {
      const next =
        typeof updater === "function" ? updater(prev) : updater;

      try {
        if (next) {
          localStorage.setItem("user", JSON.stringify(next));
        } else {
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.warn("Failed to persist user:", err);
      }

      return next;
    });
  }, []);

  // =========================================================
  // LOGOUT — clears both storages
  // =========================================================
  const logout = useCallback(() => {
    localStorage.clear();       // clears user + authToken + subscription cache
    sessionStorage.clear();     // clears semesterId, universityId, courseId
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};