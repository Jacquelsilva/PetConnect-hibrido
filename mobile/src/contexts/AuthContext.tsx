import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  AuthResponse,
  LoginCredentials,
  getSession,
  saveSession,
  clearSession,
  loginUser,
  loginWithGoogle,
} from "@/services/auth";

interface AuthContextData {
  user: AuthResponse["user"] | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<AuthResponse["user"]>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const session = await getSession();
        if (session) {
          setUser(session.user);
          setToken(session.token);
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const session = await loginUser(credentials);
      setUser(session.user);
      setToken(session.token);
    } finally {
      setIsLoading(false);
    }
  };

  const loginGoogle = async () => {
    setIsLoading(true);
    try {
      const session = await loginWithGoogle();
      setUser(session.user);
      setToken(session.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await clearSession();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedFields: Partial<AuthResponse["user"]>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    const session: AuthResponse = {
      token: token || "",
      user: newUser,
    };
    await saveSession(session);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        loginGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
