import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signUp = async (email, password) => {
    // Mock sign up - replace with your actual authentication
    console.log('Sign up:', email);
    setUser({ email });
    return { error: null };
  };

  const signIn = async (email, password) => {
    // Mock sign in - replace with your actual authentication
    console.log('Sign in:', email);
    setUser({ email });
    return { error: null };
  };

  const signOut = async () => {
    // Mock sign out - replace with your actual authentication
    setUser(null);
    return { error: null };
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}