import { products } from "@/utils/arrays/products";
import { ProductsCard } from "./productsCard";

export const FeturedProducts = () => {
  return (
    <div>
      <div className="text-center text-slate-50 text-4xl bg-primary-400">
        <h1>Productos destacados</h1>
      </div>

      <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
        {products.map((product , index) => (
          <ProductsCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};
