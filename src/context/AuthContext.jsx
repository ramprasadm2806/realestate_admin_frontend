import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authAPI
      .getMe()
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { token, admin: adminData } = res.data;
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
