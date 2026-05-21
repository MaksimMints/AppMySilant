import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({ isAuthenticated: false, loading: true });
  const [auth, setAuth] = useState({ isAuthenticated: false, loading: true });

   useEffect(() => {
    let mounted = true;
    const check = async () => {

      const token = localStorage.getItem('token');
      const ok = !!token;
      if (mounted) setAuth({ isAuthenticated: ok, loading: false });
    };
    check();
    return () => { mounted = false; };
  }, []);

  // Получение текущего пользователя
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me/', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Получение CSRF токена
  async function ensureCsrfToken() {
    const res = await fetch('/api/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch CSRF token');
    const data = await res.json();
    return data.csrf_token;
  }

  // Вход
  const login = async (username, password) => {
    try {
      const csrfToken = await ensureCsrfToken();
      const res = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        await checkAuth();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Выход
  const logout = async () => {
    try {
      const csrfToken = await ensureCsrfToken();
      await fetch('/api/logout/', {
        method: 'POST',
        headers: { 'X-CSRFToken': csrfToken },
        credentials: 'include',
      });
    } catch {

    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};