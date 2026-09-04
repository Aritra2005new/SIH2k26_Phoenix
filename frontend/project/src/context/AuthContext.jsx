import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function userFromToken(token, fallback = {}) {
  const payload = decodeJwt(token) || {};
  return {
    id: payload.user_id || payload.userId || fallback.id,
    username: payload.username || fallback.username,
    email: fallback.email,
    role: (payload.role || fallback.role || 'STARTUP').toLowerCase(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (stored) {
      setToken(stored);
      setUser(userFromToken(stored, storedUser ? JSON.parse(storedUser) : {}));
    }
    setLoading(false);
  }, []);

  async function login(username, password) {
    const data = await apiLogin(username, password);
    const nextUser = userFromToken(data.access);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh || '');
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(data.access);
    setUser(nextUser);
    return nextUser;
  }

  async function register(payload) {
    const data = await apiRegister(payload);
    // Register endpoint does not issue JWT; login immediately with the new credentials.
    const loggedIn = await apiLogin(payload.username, payload.password);
    const nextUser = userFromToken(loggedIn.access, data);
    localStorage.setItem('access_token', loggedIn.access);
    localStorage.setItem('refresh_token', loggedIn.refresh || '');
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(loggedIn.access);
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
