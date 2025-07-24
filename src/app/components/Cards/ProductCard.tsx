'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const getInitialQuantity = (productId: string): number => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return 0;
  }
  
  try {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      const existingItem = cartItems.find((item: any) => item.id === productId);
      return existingItem ? existingItem.quantity : 0;
    }
  } catch (error) {
    console.warn('Failed to get initial quantity from localStorage:', error);
  }
  return 0;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState<number>(() =>
    getInitialQuantity(product.id),
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.warn('Debes iniciar sesión para agregar productos al carrito.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedCart = localStorage.getItem('cartItems');
      let cartItems = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cartItems.find((item: any) => item.id === product.id);

      if (existingItem) {
        cartItems = cartItems.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setQuantity(quantity + 1);
      toast.success('Producto agregado al carrito.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.warn('Failed to add to cart:', error);
    }
  };

  const handleRemoveFromCart = () => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedCart = localStorage.getItem('cartItems');
      let cartItems = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cartItems.find((item: any) => item.id === product.id);

      if (existingItem && existingItem.quantity > 1) {
        cartItems = cartItems.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      } else {
        cartItems = cartItems.filter((item: any) => item.id !== product.id);
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setQuantity(quantity > 1 ? quantity - 1 : 0);
    } catch (error) {
      console.warn('Failed to remove from cart:', error);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input for better UX while typing
    if (value === '') {
      setQuantity(0);
      return;
    }
    
    const numValue = parseInt(value);
    
    // Only allow positive integers
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantity(numValue);
      
      // Check if we're in the browser environment before updating localStorage
      if (typeof window === 'undefined') {
        return;
      }

      try {
        // Update localStorage
        const storedCart = localStorage.getItem('cartItems');
        let cartItems = storedCart ? JSON.parse(storedCart) : [];
        
        const existingItem = cartItems.find((item: any) => item.id === product.id);
        
        if (numValue === 0) {
          // Remove item if quantity is 0
          cartItems = cartItems.filter((item: any) => item.id !== product.id);
        } else if (existingItem) {
          // Update existing item quantity
          cartItems = cartItems.map((item: any) =>
            item.id === product.id
              ? { ...item, quantity: numValue }
              : item,
          );
        } else if (numValue > 0) {
          // Add new item if quantity > 0
          cartItems.push({ ...product, quantity: numValue });
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.warn('Failed to update cart in localStorage:', error);
      }
    }
  };

  return (
    <Link href={`/product/${product.id}`} passHref>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 relative md:h-96 flex flex-col gap-4 ">
        <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 mb-4">
          <Image
            src={product.img}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg "
          />
        </div>
        <div>
          <h3 className="font-bold text-base ">{product.name}</h3>
          <p className="text-xs">{product.description?.slice(0, 30)}...</p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl">
            ${product.price.toFixed(2)}
          </p>
          {quantity > 0 ? (
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <button
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFromCart();
                }}
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                onClick={(e) => e.preventDefault()}
                className="w-12 h-8 text-center border-2 border-blue-300 rounded-md focus:border-blue-500 focus:outline-none bg-blue-50 font-semibold text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
                min="0"
                placeholder="0"
                title="Click to edit quantity"
              />
              <button
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
              >
                <FaPlus />
              </button>
            </div>
          ) : (
            <button
              className="absolute bottom-2 right-2 bg-blue-400 text-white p-2 rounded-full hover:bg-yellow-500 focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <FaPlus />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
