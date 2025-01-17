import { ProductCard } from "@/app/products/components/productCard";
export const ProductsGrid = ({ products }) => {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} productInfo={product} />
      ))}
    </div>
  );
};
