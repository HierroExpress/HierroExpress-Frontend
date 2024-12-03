import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import Image from "next/image";
import HeaderLogo from "@/../public/HeaderLogo.png";
import { Buscador } from "./buscador";

export const HeaderContainer = () => {
  return (
    <header className="h-16 lg:h-24 bg-primary-500 flex flex-row justify-center items-center ">
      <div className="px-4 flex flex-row justify-center items-center gap-3 ">
        <Bars3Icon className="h-8 w-8 text-white" />
        <Buscador />

        <Image src={HeaderLogo} alt="logo" width={150} height={50} />

        <UserIcon className="h-8 w-8 text-white" />

        <ShoppingCartIcon className="h-8 w-8 text-white" />
      </div>
    </header>
  );
};
