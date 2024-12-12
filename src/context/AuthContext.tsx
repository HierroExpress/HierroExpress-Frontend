"use client";
import { postLogin } from "@/utils/api/auth/login";
import { postRegister } from "@/utils/api/auth/register";
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext({
  user: null,
  error: null,
  isLoggedIn: false,
  Justregistered: false,
  token: null,

  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [Justregistered, setJustregistered] = useState(false);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await postLogin({ email, password });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      setUser(response.user);
      setIsLoggedIn(true);
      setToken(response.token);
      setError(null);
    } catch (error) {
      setError(error.message);
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
    
const Register = async ({
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
        if (!response.ok) {
            throw new Error("Registration failed");
        }
        setUser(response.user);
        setError(null);
        setJustregistered(true);
    } catch (error) {
        setError(error.message);
    }

  return (
    <AuthContext.Provider value={{ user, error, isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
