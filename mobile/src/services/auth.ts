export interface LoginCredentials {
  document: string; // CPF or CNPJ
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    document: string;
    type: "user" | "ong";
  };
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://api.petconnect.com.br";

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Credenciais inválidas ou erro no servidor.");
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error: any) {
    // If network fails during offline prototype testing, provide a mock fallback or rethrow
    if (error.message && error.message.includes("Network request failed")) {
      // Mock successful login for offline / local demo purposes if API is unreachable
      console.warn("API unreachable, using offline fallback auth.");
      return {
        token: "mock-jwt-token-12345",
        user: {
          id: "1",
          name: "PetConnect User",
          document: credentials.document,
          type: "user",
        },
      };
    }
    throw error;
  }
}
