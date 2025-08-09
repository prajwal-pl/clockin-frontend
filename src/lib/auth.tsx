"use client";
import React from "react";
import { AuthAPI, type User } from "./api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (p: { email: string; password: string }) => Promise<void>;
  register: (p: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const me = await AuthAPI.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Attempt session restore if token exists
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh]);

  const login = async (p: { email: string; password: string }) => {
    const { user, token } = await AuthAPI.login(p);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (p: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { user, token } = await AuthAPI.register(p);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireManager({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = (
    typeof window !== "undefined" ? require("next/navigation") : null
  )?.useRouter?.();
  const isManager = user?.role === "MANAGER" || user?.role === "ADMIN";

  React.useEffect(() => {
    if (!loading && !isManager) router?.replace?.("/worker/clock");
  }, [loading, isManager, router]);

  if (loading) return null;
  if (!isManager) return null;
  return <>{children}</>;
}
