import { ProductCard } from "@/app/products/components/productCard";
export const ProductsGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} productInfo={product} />
      ))}
    </div>
  );
};
