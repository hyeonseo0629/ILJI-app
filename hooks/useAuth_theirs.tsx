import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'ilji_session';

// Define the shape of the user session
export type SessionUser = {
  user: { name: string; email: string; photo?: string };
  token: string;
};

// Define the shape of the authentication context
interface AuthContextType {
  signIn: (user: SessionUser) => Promise<void>;
  signOut: () => Promise<void>;
  session?: SessionUser | null;
  isLoading: boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to access the authentication session
export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return value;
}

// Provider component that manages authentication state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          setSession(parsedSession);
        } else {
          // No session found, this is fine.
        }
      } catch (e) {
        console.error("Failed to load session from secure store", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (user: SessionUser) => {
    setSession(user);
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save session to SecureStore", e);
    }
  };

  const signOut = async () => {
    setSession(null);
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error("Failed to delete session from SecureStore", e);
    }
  };

  // This comment is added to force a re-write of the file.
  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
