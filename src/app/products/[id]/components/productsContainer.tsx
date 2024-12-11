import { getProductById } from "@/utils/api/products/getProductById";
import { AddToCar } from "./addToCar";

export const ProductContainer = async ({ id }: { id: string }) => {
  const product = await getProductById(parseInt(id));
  return (
    <div>
      <img src={product.img} alt={product.name} className="w-full " />
      <h1>{product.name}</h1>
      <p>Precio: ${product.price}</p>
      <p>{product.description}</p>
      <AddToCar />
    </div>
  );
};
