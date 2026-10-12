'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { productImageSource } from '@/lib/productImage';

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
  const [quantity, setQuantity] = useState<number>(() =>
    getInitialQuantity(product.id),
  );

  const handleAddToCart = () => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedCart = localStorage.getItem('cartItems');
      let cartItems = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cartItems.find(
        (item: any) => item.id === product.id,
      );

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
      window.dispatchEvent(new Event('cart:updated'));
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

      const existingItem = cartItems.find(
        (item: any) => item.id === product.id,
      );

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
      window.dispatchEvent(new Event('cart:updated'));
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

        const existingItem = cartItems.find(
          (item: any) => item.id === product.id,
        );

        if (numValue === 0) {
          // Remove item if quantity is 0
          cartItems = cartItems.filter((item: any) => item.id !== product.id);
        } else if (existingItem) {
          // Update existing item quantity
          cartItems = cartItems.map((item: any) =>
            item.id === product.id ? { ...item, quantity: numValue } : item,
          );
        } else if (numValue > 0) {
          // Add new item if quantity > 0
          cartItems.push({ ...product, quantity: numValue });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cart:updated'));
      } catch (error) {
        console.warn('Failed to update cart in localStorage:', error);
      }
    }
  };

  return (
    <article className="he-product-card">
      <Link href={`/product/${product.id}`} className="he-product-visual">
        <Image
          src={productImageSource(product.img)}
          alt={product.name}
          fill
          sizes="(max-width: 700px) 45vw, 300px"
          style={{ objectFit: 'contain' }}
        />
      </Link>
      <div className="he-product-info">
        <Link href={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        {product.description && <p>{product.description.slice(0, 65)}</p>}
        <Link className="he-product-detail" href={`/product/${product.id}`}>
          Ver medidas y detalles
        </Link>
        <div className="he-product-bottom">
          <strong>${product.price.toFixed(2)}</strong>
          {quantity > 0 ? (
            <div className="he-quantity">
              <button
                aria-label="Quitar una unidad"
                onClick={handleRemoveFromCart}
              >
                −
              </button>
              <input
                aria-label="Cantidad"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={quantity}
                onChange={handleQuantityChange}
                min="0"
              />
              <button aria-label="Agregar una unidad" onClick={handleAddToCart}>
                +
              </button>
            </div>
          ) : (
            <button
              className="he-add-product"
              aria-label={`Agregar ${product.name} al carrito`}
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
export default ProductCard;
