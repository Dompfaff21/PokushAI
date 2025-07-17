import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    username: ''
  });

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || '';
    if (userId) {
      setAuthState({
        isAuthenticated: true,
        username
      });
    }
  }, []);

  const login = (userId, username) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setAuthState({
      isAuthenticated: true,
      username
    });
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      username: ''
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};