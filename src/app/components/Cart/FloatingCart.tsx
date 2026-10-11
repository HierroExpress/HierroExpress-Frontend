'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

type CartItem = { quantity?: number };

function cartQuantity() {
  try {
    const items: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return items.reduce((total, item) => {
      const quantity = Number(item.quantity);
      return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
    }, 0);
  } catch {
    return 0;
  }
}

export default function FloatingCart() {
  const pathname = usePathname();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const refresh = () => setQuantity(cartQuantity());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('cart:updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('cart:updated', refresh);
    };
  }, []);

  if (!quantity || pathname === '/cart' || pathname === '/checkout') return null;

  return (
    <Link
      href="/cart"
      className="he-floating-cart"
      aria-label={`Ver mi carrito: ${quantity} ${quantity === 1 ? 'producto' : 'productos'}`}
    >
      <span className="he-floating-cart-count" aria-hidden="true">{quantity}</span>
      <span>Ver mi carrito</span>
      <ArrowRight aria-hidden="true" size={25} strokeWidth={2.6} />
    </Link>
  );
}
