import { Product } from "./types";

export const ProductsCard = ({ product }: { product: Product }) => {
  return (
    <div className=" h-72 w-40n lg:h-96 lg:w-64 flex flex-col justify-center items-center shadow-sm">
      <img src={product.image} alt="producto" />
      <h5>{product.name}</h5>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
    </div>
  );
};
