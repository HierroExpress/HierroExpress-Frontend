import Link from "next/link";
import { Product } from "../types";
import MiniAddToCart from "./miniAddToCar";

export const ProductCard = ({ productInfo }: { productInfo: Product }) => {
  return (
    <div>
      <Link href={`/products/${productInfo.id}`}>
        <div className="w-48 h-72 px-2 pb-2 lg:w-64 lg:h-96 bg-white rounded-lg shadow-md flex flex-col items-center">
          {/* Contenedor de la imagen */}
          <div className="w-full h-4/5 flex justify-center items-center">
            {/* Imagen escalada */}
            <img
              src={productInfo.img}
              alt={productInfo.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Contenedor del contenido */}
          <div className="w-full flex flex-col items-center mt-2">
            <h2 className="text-center text-sm font-semibold">
              {productInfo.name}
            </h2>
            <p className="text-center text-gray-600">
              Precio: ${productInfo.price}
            </p>
          </div>
        </div>
      </Link>
      <MiniAddToCart productInfo={productInfo} />
    </div>
  );
};
