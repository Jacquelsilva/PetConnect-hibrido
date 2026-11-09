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
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

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

    // Listen to Firebase Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const tokenVal = await fbUser.getIdToken();
          setToken(tokenVal);
        } catch (e) {
          console.error("Erro ao obter ID token do Firebase:", e);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Firestore real-time listener for user profile updates
  useEffect(() => {
    if (!auth.currentUser) return;
    const userUid = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userUid);

    const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser((prev) => {
          if (!prev) return null;
          const updated = {
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            document: data.document || data.cpf || data.cnpj || prev.document,
            photoUrl: data.photoUrl || data.foto || prev.photoUrl,
            whatsapp: data.whatsapp || data.phone || prev.whatsapp,
          };
          saveSession({ token: token || "", user: updated });
          return updated;
        });
      }
    }, (error) => {
      console.warn("Erro no listener Firestore do usuário:", error);
    });

    return () => {
      unsubscribeSnapshot();
    };
  }, [auth.currentUser?.uid]);

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
