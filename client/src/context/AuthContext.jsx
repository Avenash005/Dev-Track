import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { socketService } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('devtrack_token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devtrack_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const fetchSubscription = async () => {
    if (!token) return;
    try {
      const res = await api.payment.getSubscription();
      if (res?.data?.subscription) {
        setSubscription(res.data.subscription);
      }
    } catch (err) {
      console.warn('[AUTH] Could not fetch subscription:', err.message);
    }
  };

  // Validate session on mount
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          socketService.connect(token);
          const res = await api.auth.getMe();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('devtrack_user', JSON.stringify(res.data));
          }
          await fetchSubscription();
        } catch (err) {
          console.warn('[AUTH] Session token expired or invalid:', err.message);
          // If 401, clear expired token
          if (err.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res?.data) {
        const { user: authedUser, token: authToken } = res.data;
        setUser(authedUser);
        setToken(authToken);
        localStorage.setItem('devtrack_user', JSON.stringify(authedUser));
        localStorage.setItem('devtrack_token', authToken);
        socketService.connect(authToken);
        return { success: true, user: authedUser };
      }
      return { success: false, message: 'Invalid response from server.' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.auth.register({ name, email, password });
      if (res?.data) {
        const { user: authedUser, token: authToken } = res.data;
        setUser(authedUser);
        setToken(authToken);
        localStorage.setItem('devtrack_user', JSON.stringify(authedUser));
        localStorage.setItem('devtrack_token', authToken);
        socketService.connect(authToken);
        return { success: true, user: authedUser };
      }
      return { success: false, message: 'Invalid response from server.' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    socketService.disconnect();
    setUser(null);
    setToken('');
    localStorage.removeItem('devtrack_user');
    localStorage.removeItem('devtrack_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        subscription,
        fetchSubscription,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
