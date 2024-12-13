"use client";
import { ShoppingCart } from "lucide-react";
import { Product } from "../types";
import { useShoppingCart } from "@/context/CartContext";
import { useEffect } from "react";

const MiniAddToCart = ({ productInfo }: { productInfo: Product }) => {
  const { addToCart, cart } = useShoppingCart();

  useEffect(() => {
    console.log("productInfo", productInfo);
  }, [productInfo]);

  const handleAddToCart = () => {
    addToCart({
      product: {
        id: productInfo.id,
        name: productInfo.name,
        price: productInfo.price,
        img: productInfo.img,
      },
      quantity: 1,
    });
    console.log("addToCart");
    console.log("cart", cart);
  };
  return (
    <button
      className="flex flex-col items-center justify-center"
      onClick={handleAddToCart}>
      <ShoppingCart className="text-xs text-gray-500" />
      <p className="text-xs text-gray-500">Agregar al carrito</p>
    </button>
  );
};

export default MiniAddToCart;
