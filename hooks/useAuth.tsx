import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'ilji_session';

// Define the shape of the user session
export type SessionUser = {
  user: { id: number; name: string; email: string; photo?: string };
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
          console.log('[AuthProvider] Session loaded from store:', JSON.stringify(parsedSession, null, 2));
          setSession(parsedSession);
        } else {
          console.log('[AuthProvider] No session found in store.');
        }
      } catch (e) {
        console.error("Failed to load session from secure store", e);
      } finally {
        setIsLoading(false);
      }
    };

    console.log('[AuthProvider] Initial mount. Loading session...');
    loadSession();
  }, []);

  const signIn = async (user: SessionUser) => {
    console.log('[AuthProvider] Attempting to sign in and set session for user ID:', user.user.id);
    console.log('[AuthProvider] Session data being set:', JSON.stringify(user, null, 2));
    setSession(user);
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(user));
      console.log('[AuthProvider] ✅ Session successfully saved to secure store.');
    } catch (e) {
      console.error("[AuthProvider] 🛑 Failed to save session to SecureStore", e);
    }
  };

  const signOut = async () => {
    console.log('[AuthProvider] signOut called.');
    setSession(null);
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      console.log('[AuthProvider] Session deleted from store.');
    } catch (e) {
      console.error("Failed to delete session from SecureStore", e);
    }
  };

  console.log('[AuthProvider] Rendering. Current session state:', session ? `User ID: ${session.user.id}`: 'null');
  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
