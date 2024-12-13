"use client";
import "./globals.css";
import MapProvider from "./shared/maps/constextMap";
import { HeaderContainer } from "./shared/header/headerContainer";
import { FooterContainer } from "./shared/footer/footerContainer";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ShoppingCartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "dark" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  return (
    <MapProvider>
      <AuthProvider>
        <ShoppingCartProvider>
          <html lang="en">
            <body className="min-h-screen bg-white dark:bg-gray-900 dark:text-white text-black transition-colors">
              <HeaderContainer />
              {children}
              <FooterContainer />
            </body>
          </html>
        </ShoppingCartProvider>
      </AuthProvider>
    </MapProvider>
  );
}
