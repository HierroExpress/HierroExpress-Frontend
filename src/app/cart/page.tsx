'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productImageSource } from '@/lib/productImage';
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  img: string;
}
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('cartItems') || '[]'));
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);
  const save = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem('cartItems', JSON.stringify(next));
    window.dispatchEvent(new Event('cart:updated'));
  };
  const change = (id: number, quantity: number) =>
    save(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                item.stock > 0 ? item.stock : 10000,
                Math.max(1, quantity),
              ),
            }
          : item,
      ),
    );
  if (!ready)
    return <main className="he-container he-cart-page">Cargando carrito…</main>;
  return (
    <main className="he-container he-cart-page">
      <h1>Tu carrito</h1>
      <p>Podés comprar sin crear una cuenta.</p>
      {items.length === 0 ? (
        <div className="he-cart-box">
          <h2>Tu carrito está vacío</h2>
          <Link className="he-button he-button-orange" href="/menu2">
            Elegir productos
          </Link>
        </div>
      ) : (
        <>
          <div className="he-cart-box">
            {items.map((item) => (
              <article className="he-cart-row" key={item.id}>
                <img src={productImageSource(item.img)} alt={item.name} />
                <div>
                  <Link href={`/product/${item.id}`}>
                    <h2>{item.name}</h2>
                  </Link>
                  <p>Precio por unidad: U$S {item.price.toFixed(2)}</p>
                </div>
                <label>
                  Cantidad
                  <input
                    type="number"
                    min="1"
                    max={item.stock > 0 ? item.stock : 10000}
                    value={item.quantity}
                    onChange={(e) => change(item.id, Number(e.target.value))}
                  />
                </label>
                <strong>U$S {(item.price * item.quantity).toFixed(2)}</strong>
                <button
                  className="he-remove-item"
                  onClick={() => save(items.filter((p) => p.id !== item.id))}
                >
                  Quitar
                </button>
              </article>
            ))}
          </div>
          <div className="he-cart-summary">
            <h2>
              Subtotal: U$S{' '}
              {items
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </h2>
            <p>
              El envío se coordina según tu dirección. Revisaremos los precios
              antes de confirmar.
            </p>
            <button
              className="he-button he-button-orange"
              onClick={() => router.push('/checkout')}
            >
              Continuar con mis datos y envío
            </button>
            <Link href="/menu2" className="he-text-link">
              Agregar más productos
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
