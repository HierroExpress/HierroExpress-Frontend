"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

interface IProduct {
  id: number;
  name: string;
  price: number;
  img: string;
}

const initialCartState = {
  items: [], // Each item: { productId, name, price, quantity, img }
};

const ShoppingCartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity,
              img: product.img,
            },
          ],
        };
      }
    }
    case "REMOVE_FROM_CART": {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== productId),
      };
    }
    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        ),
      };
    }
    case "CLEAR_CART": {
      return initialCartState;
    }
    default:
      return state;
  }
};

export const ShoppingCartProvider = ({ children }) => {
  // Restore the initial state from localStorage if available
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    (initial) => {
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem("shoppingCart");
        return storedCart ? JSON.parse(storedCart) : initial;
      }
      return initial;
    }
  );

  // Sync the cart state with localStorage
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(state));
  }, [state]);

  const addToCart = ({
    product,
    quantity,
  }: {
    product: IProduct;
    quantity: number;
  }) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } });
  };

  const removeFromCart = ({ productId }: { productId: number }) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
  };

  const updateQuantity = ({
    productId,
    quantity,
  }: {
    productId: number;
    quantity: number;
  }) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartTotal = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cart: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider"
    );
  }
  return context;
};
