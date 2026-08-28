import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (err) => {
      console.error('Auth state error:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google sign-in failed');
      throw err;
    }
  };

  const signInAsGuest = async () => {
    try {
      setError(null);
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error('Guest Sign-In Error:', err);
      setError(err.message || 'Guest sign-in failed');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Sign Out Error:', err);
      setError(err.message || 'Sign out failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
