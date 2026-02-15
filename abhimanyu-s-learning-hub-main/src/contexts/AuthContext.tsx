import { createContext, useContext, useState, ReactNode } from "react";
import { api } from "@/lib/api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(
    localStorage.getItem("email")
      ? { email: localStorage.getItem("email")! }
      : null
  );

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("role") === "admin"
  );

  const login = async (email: string, password: string) => {
  const res = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", res.token);
  localStorage.setItem("role", res.user.role);
  localStorage.setItem("email", res.user.email);

  setUser({ email: res.user.email });
  setIsAdmin(res.user.role === "admin");
};

  const register = async ({ name, email, password }: RegisterPayload) => {
  const res = await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  localStorage.setItem("token", res.token);
  localStorage.setItem("role", res.role);
  localStorage.setItem("email", res.email);

  setUser({ email: res.email });
  setIsAdmin(res.role === "admin");
};


  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isAdmin,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
