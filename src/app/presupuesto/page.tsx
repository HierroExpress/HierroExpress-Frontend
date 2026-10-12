'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function QuotePage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('cartItems') || '[]'));
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items],
  );

  if (!ready) return <main className="he-container he-cart-page">Preparando presupuesto…</main>;

  if (!items.length) {
    return (
      <main className="he-container he-cart-page">
        <section className="he-cart-box">
          <h1>Tu presupuesto está vacío</h1>
          <p>Elegí los materiales y cantidades para preparar un presupuesto.</p>
          <Link className="he-button he-button-orange" href="/menu2">Elegir productos</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="he-container he-cart-page he-quote-page">
      <section className="he-cart-box he-quote-document">
        <header className="he-quote-heading">
          <div>
            <p className="he-eyebrow">HIERRO EXPRESS</p>
            <h1>Presupuesto de materiales</h1>
            <p>Fecha: {new Intl.DateTimeFormat('es-UY', { dateStyle: 'long' }).format(new Date())}</p>
          </div>
          <p>Montevideo, Uruguay</p>
        </header>
        <table className="he-quote-table">
          <thead><tr><th>Material</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>U$S {Number(item.price).toFixed(2)}</td>
                <td>U$S {(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={3}>Total de materiales</td><td>U$S {total.toFixed(2)}</td></tr></tfoot>
        </table>
        <p className="he-quote-note">El envío se calcula según la dirección de entrega. Los precios se confirman al realizar el pedido.</p>
        <div className="he-actions he-quote-actions">
          <button type="button" className="he-button he-button-orange" onClick={() => window.print()}>Imprimir presupuesto</button>
          <Link href="/cart" className="he-button he-button-outline">Modificar productos</Link>
          <Link href="/checkout" className="he-text-link">Continuar con el pedido</Link>
        </div>
      </section>
    </main>
  );
}
