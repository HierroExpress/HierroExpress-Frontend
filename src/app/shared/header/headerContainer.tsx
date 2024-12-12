"use client";

import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import { useState } from "react";
import HeaderLogo from "@/../public/HeaderLogo.png";
import { Buscador } from "./buscador";
import Link from "next/link";
export const HeaderContainer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
    
  };

  return (
    <header className="h-16 lg:h-24 bg-primary-500 flex flex-row items-center justify-between px-4 ">
      <div className="flex items-center gap-3">
        <Bars3Icon className="h-8 w-8 text-white" />
        <Link href="/home">
          <Image
            src={HeaderLogo}
            alt="logo"
            width={150}
            height={50}
            className="ml-4"
          />
        </Link>{" "}
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Buscador />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
        <Link href="/auth/login">
          <UserIcon className="h-8 w-8 text-white" />
        </Link>{" "}
        <ShoppingCartIcon className="h-8 w-8 text-white" />
      </div>
    </header>
  );
};
