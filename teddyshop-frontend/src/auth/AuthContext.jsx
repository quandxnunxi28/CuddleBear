import React, { createContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '../utils/storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra token khi ứng dụng khởi động
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      // TODO: Fetch user info từ backend nếu cần
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    removeToken();
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
