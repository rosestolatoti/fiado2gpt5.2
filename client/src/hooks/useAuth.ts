import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { AdminUser, AuthContextType } from "@/types/affiliate";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar token ao carregar
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const decoded = jwtDecode(token) as any;
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          permissions: decoded.permissions,
          password: "", // Não armazenamos senha no frontend
          lastLogin: decoded.lastLogin,
          createdAt: decoded.createdAt
        });
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("auth_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type") || "";
      const rawText = await response.text();
      if (!rawText) {
        throw new Error(`Resposta vazia do servidor (${response.status})`);
      }
      if (!contentType.includes("application/json")) {
        throw new Error(`Resposta inválida do servidor (${response.status})`);
      }
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Resposta inválida do servidor");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Erro no login");
      }

      if (data?.success) {
        const userData = data.data.user;
        const token = data.data.token;

        // Salvar token
        localStorage.setItem("auth_token", token);

        // Atualizar estado
        setUser(userData);

        return true;
      } else {
        throw new Error(data.error || "Erro no login");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  const contextValue = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

// Hook para verificar permissões
export function usePermissions() {
  const { user } = useAuth();
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}
