import { useState, useEffect } from "react";
import type { User } from "@/user/types";
import { AuthContext } from "./AuthContext";
import { authApi } from "../api/authApi";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await authApi.checkAuth();
      setUser(userData);
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const userData = await authApi.login(username, password);
      console.log("login success", userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      console.log("logout success");
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
