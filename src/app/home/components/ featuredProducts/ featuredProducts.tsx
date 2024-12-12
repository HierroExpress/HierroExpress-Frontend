import { products } from "@/utils/arrays/products";
import { ProductsCard } from "./productsCard";

export const FeturedProducts = () => {
  return (
    <div>
      <div className="text-center text-slate-50 text-4xl bg-primary-250 py-6">
        <h1 className="mb-8">Productos destacados</h1>
      </div>
      <div className="flex flex-row justify-center items-center gap-4 flex-wrap py-6">
        {products.map((product, index) => (
          <ProductsCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};
