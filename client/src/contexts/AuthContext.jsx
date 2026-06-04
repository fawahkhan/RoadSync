import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if token exists and validate it
  useEffect(() => {
    const token = localStorage.getItem('roadsync_token');
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('roadsync_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (name, email, password) => {
    try {
      const res = await authAPI.signup({ name, email, password });
      localStorage.setItem('roadsync_token', res.data.token);
      setUser(res.data.user);
      return { error: null };
    } catch (error) {
      return {
        error: error.response?.data?.message || 'Signup failed. Please try again.',
      };
    }
  };

  const signIn = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('roadsync_token', res.data.token);
      setUser(res.data.user);
      return { error: null };
    } catch (error) {
      return {
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('roadsync_token');
    setUser(null);
    return { error: null };
  };

  // Refresh user data (after gem updates, badge awards, etc.)
  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    refreshUser,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}