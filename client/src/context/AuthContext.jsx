import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
    }
    if (storedRole) {
      setRole(storedRole);
    }

    setIsAuthReady(true);
  }, []);


  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');

      setIsLoggedIn(!!token);
      setRole(storedRole || '');
    };

    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsLoggedIn(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}
