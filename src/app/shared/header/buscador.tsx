import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export const Buscador = () => {
  return (
    <>
      <MagnifyingGlassIcon className="h-8 w-8 text-white lg:hidden" />
      <div className=" border-2 px-2 border-white rounded-full hidden lg:flex  flex-row justify-center items-center gap-2 bg-white">
        <input type="text" />
        <MagnifyingGlassIcon className="h-8 w-8 text-primary-500" />
      </div>
    </>
  );
};