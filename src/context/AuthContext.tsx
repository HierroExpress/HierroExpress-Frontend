"use client";

import { postLogin } from "@/utils/api/auth/login";
import { postRegister } from "@/utils/api/auth/register";
import React, { createContext, useState, useContext } from "react";

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
  const [user, setUser] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [Justregistered, setJustregistered] = useState(false);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await postLogin({ email, password });
      console.log(response);      
      setUser(response.user);
      setIsLoggedIn(true);
      setToken(response.access_token);
      setError(null);
    } catch (error: any) {
      console.log(error);      
      setError(error.response?.data?.message || error.message);
      setIsLoggedIn(false);
      setToken(null);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
    setError(null);
  };

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
      setIsLoggedIn(false)
      setUser(null)
    } catch (error: any) {
      console.log(error);
      
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, error, isLoggedIn, Justregistered, token, login, logout, register }}
    >
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
