"use client";

import { useShoppingCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
  } = useShoppingCart();

  return (
    <div className="min-h-screen bg-background-100 dark:bg-background-800 text-primary-500 dark:text-primary-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

      {cart.length > 0 ? (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-4 bg-white dark:bg-primary-700 shadow rounded-md">
                {/* Imagen del Producto */}
                <div className="flex items-center gap-4">
                  {item.img ? (
                    <img src={item.img} className="rounded-md w-28 h-28" />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      Sin Imagen
                    </div>
                  )}
                  {/* Detalles del Producto */}
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      Precio: ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Controles de Cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity({
                        productId: item.productId,
                        quantity: item.quantity - 1,
                      })
                    }
                    className="px-2 py-1 bg-secondary-500 text-white rounded-md hover:bg-secondary-600">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity({
                        productId: item.productId,
                        quantity: item.quantity + 1,
                      })
                    }
                    className="px-2 py-1 bg-secondary-500 text-white rounded-md hover:bg-secondary-600">
                    +
                  </button>
                </div>

                {/* Botón de Eliminar */}
                <button
                  onClick={() => removeFromCart({ productId: item.productId })}
                  className="text-red-500 hover:text-red-600">
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* Resumen del Carrito */}
          <div className="mt-6 p-4 bg-white dark:bg-primary-700 shadow rounded-md">
            <h2 className="text-xl font-semibold">Resumen</h2>
            <p className="mt-2">
              Total de Artículos: <strong>{getCartItemCount()}</strong>
            </p>
            <p className="mt-2">
              Total: <strong>${getCartTotal().toFixed(2)}</strong>
            </p>
            <button className="w-full mt-4 bg-secondary-500 text-white py-2 rounded-md hover:bg-secondary-600">
              Finalizar Compra
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-500">Tu carrito está vacío.</p>
          <Link
            href="/home"
            className="mt-4 inline-block bg-secondary-500 text-white py-2 px-4 rounded-md hover:bg-secondary-600">
            Seguir Comprando
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
