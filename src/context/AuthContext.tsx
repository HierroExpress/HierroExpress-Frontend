"use client";

import { postLogin } from "@/utils/api/auth/login";
import { postRegister } from "@/utils/api/auth/register";
import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  user: any;
  error: string | null;
  isLoggedIn: boolean;
  Justregistered: boolean;
  token: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    NIN: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado local para mantener los datos del usuario
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [Justregistered, setJustregistered] = useState(false);

  // Recuperar el estado del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedUser && storedToken && storedIsLoggedIn === "true") {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Función de login
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await postLogin({ email, password });
      console.log(response);

      // Guardar en el localStorage
      setUser(response.user);
      setIsLoggedIn(true);
      setToken(response.access_token);
      setError(null);

      // Guardar en el localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("isLoggedIn", "true");
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || error.message);
      setIsLoggedIn(false);
      setToken(null);

      // Eliminar cualquier dato en caso de error
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
    setError(null);

    // Limpiar el localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
  };

  // Función de register
  const register = async ({
    name,
    email,
    password,
    confirmPassword,
    phone,
    NIN,
  }: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    NIN: string;
  }) => {
    try {
      const response = await postRegister({
        name,
        email,
        password,
        confirmPassword,
        phone,
        NIN,
      });

      console.log(response);

      setError(null);
      setJustregistered(true);
      setIsLoggedIn(false);
      setUser(null);

      // Limpiar cualquier dato relacionado al usuario
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.setItem("isLoggedIn", "false");
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isLoggedIn,
        Justregistered,
        token,
        login,
        logout,
        register,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
