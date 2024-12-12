import { Product } from "./types";
import { Heart } from "lucide-react";

export const ProductsCard = ({ product }: { product: Product }) => {
  return (
    <a href={`/product/${product.id}`} className="block group relative">
      <div className="h-72 w-40 lg:h-96 lg:w-64 bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl relative">
        <div className="absolute top-2 right-2 z-10">
          <button className="text-gray-400 hover:text-red-400 transition-colors">
            <Heart
              className="w-6 h-6 hover:fill-red-500/20 opacity-70 group-hover:opacity-100"
              strokeWidth={1.5}
              stroke="currentColor"
            />
          </button>
        </div>

        <div className="h-2/3 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70"></div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="p-4 space-y-2 text-white">
          <h5 className="font-bold text-lg truncate text-white/90">
            {product.name}
          </h5>
          <p className="text-gray-300 text-sm line-clamp-2">
            {product.description}
          </p>
          <p className="font-bold text-xl text-blue-400">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600 rounded-lg transition-all duration-300"></div>
      </div>
    </a>
  );
};
