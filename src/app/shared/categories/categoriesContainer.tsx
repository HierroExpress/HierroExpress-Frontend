import { categories } from "@/utils/arrays/categories";

import { CartCategory } from "./cartCategory";

export const CategoriesContainer = () => {
  return (
    <div className="flex flex-row justify-center items-center gap-2 flex-wrap">
      {categories.map((category) => (
        <CartCategory key={category.id} category={category} />
      ))}
    </div>
  );
};
