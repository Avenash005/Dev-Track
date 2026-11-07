import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devtrack_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default demo user for Phase 1 exploration
    return {
      id: 'usr-1',
      name: 'Alex Chen',
      email: 'alex.chen@devtrack.ai',
      role: 'Full-Stack Developer Student',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('devtrack_token') || 'demo-jwt-token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('devtrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('devtrack_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('devtrack_token', token);
    } else {
      localStorage.removeItem('devtrack_token');
    }
  }, [token]);

  const login = async (email, password) => {
    // Phase 1 demo login - will connect to /api/auth/login in Phase 2
    const mockUser = {
      id: 'usr-1',
      name: email.split('@')[0] || 'Dev User',
      email,
      role: 'Software Engineer',
    };
    setUser(mockUser);
    setToken('sample-jwt-token-' + Date.now());
    return { success: true, user: mockUser };
  };

  const register = async (name, email, password) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      role: 'Student Developer',
    };
    setUser(newUser);
    setToken('sample-jwt-token-' + Date.now());
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('devtrack_user');
    localStorage.removeItem('devtrack_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user }}>
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

