import { CategoryResponse } from "@/app/shared/categories/types";
// export const CategoriesButtons = ({
//   categories,
//   onSelectCategory,
// }: {
//   categories: CategoryResponse[];
//   onSelectCategory: (categoryId: number) => void;
// }) => (
//   <div className="categories-buttons">
//     {categories.map((category) => (
//       <div
//         key={category.id}
//         onClick={() => onSelectCategory(category.id)}
//         className="shadow-sm flex flex-col items-center justify-between gap-2 p-4 w-40 lg:w-64 h-48 lg:h-40">
//         <div className="h-24 w-24 bg-secondary-500 rounded-full flex items-center justify-center">
//           <category.icon className="h-16 w-16 text-black" />
//         </div>
//         <h5 className="text-center">{category.name}</h5>
//       </div>
//     ))}
//   </div>
// );

export const SubCategoriesButtons = ({
  categories,
  onSelectCategory,
}: {
  categories: CategoryResponse[];
  onSelectCategory: (categoryId: number) => void;
}) => (
  <div className="categories-buttons flex flex-wrap gap-2">
    {categories.slice(0, 10).map((category) => (
      <div
        key={category.id}
        onClick={() => onSelectCategory(category.id)}
        className="shadow-sm flex flex-col items-center justify-between gap-2 p-4 w-40 lg:w-64 h-48 lg:h-40">
        <div className="h-24 w-24 bg-orange-500 rounded-full flex items-center justify-center">
          <img
            src={category.icon} // Renderiza la URL como una imagen
            alt={category.name}
            className="h-16 w-16 object-contain"
          />
        </div>
        <h5 className="text-center">{category.name}</h5>
      </div>
    ))}
  </div>
);
