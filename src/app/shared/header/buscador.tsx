import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export const Buscador = () => {
  return (
    <>
      {/* Icono para móviles */}
      <MagnifyingGlassIcon className="h-8 w-8 text-white lg:hidden" />

      {/* Buscador en pantallas grandes */}
      <div className="border-2 px-3 py-2 border-white rounded-lg hidden lg:flex items-center gap-3 bg-white shadow-sm">
        <input
          type="text"
          className="w-full h-10 px-3 text-base text-gray-800 bg-transparent outline-none rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="Buscar..."
        />
        <MagnifyingGlassIcon className="h-6 w-6 text-primary-500" />
      </div>
    </>
  );
};
