
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  updateUser: (
    updatedUser: Partial<AuthResponse["user"]>
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  // Recupera a sessão salva
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

  // Observa autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUid(fbUser.uid);

        try {
          const tokenVal = await fbUser.getIdToken();

          const session = await getSession();

          // Não sobrescreve uma sessão local SQLite
          if (!session?.token.startsWith("local-")) {
            setToken(tokenVal);
          }
        } catch (error) {
          console.error("Erro ao obter token Firebase:", error);
        }
      } else {
        setFirebaseUid(null);
      }
    });

    return unsubscribe;
  }, []);

  // Listener do Firestore somente para contas Firebase
  useEffect(() => {
    if (!firebaseUid || !auth.currentUser) return;

    if (token?.startsWith("local-")) return;

    const userDocRef = doc(db, "users", firebaseUid);

    const unsubscribe = onSnapshot(
      userDocRef,
      async (docSnap) => {
        if (!docSnap.exists()) return;

        const data = docSnap.data();

        setUser((prev) => {
          if (!prev || prev.id !== firebaseUid) return prev;

          const updatedUser = {
            ...prev,
            name: data.name || data.nome || prev.name,
            email: data.email || prev.email,
            document:
              data.document ||
              data.cpf ||
              data.cnpj ||
              prev.document,
            photoUrl:
              data.photoUrl ||
              data.foto ||
              prev.photoUrl,
            whatsapp:
              data.whatsapp ||
              data.phone ||
              prev.whatsapp,
          };

          const session: AuthResponse = {
            token: token || "",
            user: updatedUser,
          };

          saveSession(session).catch((error) => {
            console.error("Erro ao salvar sessão:", error);
          });

          return updatedUser;
        });
      },
      (error) => {
        console.warn("Erro no listener Firestore:", error);
      }
    );

    return unsubscribe;
  }, [firebaseUid, token]);

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
      setFirebaseUid(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza o usuário no contexto e na sessão
  const updateUser = async (
    updatedFields: Partial<AuthResponse["user"]>
  ) => {
    const storedSession = await getSession();
    const currentUser = user ?? storedSession?.user;

    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    const updatedSession: AuthResponse = {
      token: token ?? storedSession?.token ?? "",
      user: updatedUser,
    };

    setUser(updatedUser);

    await saveSession(updatedSession);
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
