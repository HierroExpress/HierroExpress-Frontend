import { Category } from "./types";

export const CartCategory = ({ category }: { category: Category }) => {
  return (
    <div className="shadow-sm flex flex-col items-center justify-between gap-2 p-4 w-40 lg:w-64 h-48 lg:h-40">
      <div className="h-24 w-24 bg-secondary-500 rounded-full flex items-center justify-center">
        <category.image className="h-16 w-16 text-black" />
      </div>
      <h5 className="text-center">{category.name}</h5>
    </div>
  );
};
