'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || searchParams.get('result');
  const isApproved = status === 'approved';
  const isPending = status === 'pending' || status === 'in_process';
  const title = isApproved
    ? 'Pago recibido'
    : isPending
      ? 'Tu pago está pendiente'
      : 'No se pudo completar el pago';
  const message = isApproved
    ? 'Recibimos la confirmación de Mercado Pago. Prepararemos tu pedido y te contactaremos para coordinar la entrega.'
    : isPending
      ? 'Mercado Pago todavía está confirmando el pago. Cuando se acredite, actualizaremos el pedido.'
      : 'No se realizó el cobro. Podés volver al carrito e intentar nuevamente o elegir pago a coordinar.';

  return (
    <main className="he-container he-checkout-page">
      <section className="he-cart-box" role="status">
        <p className="he-eyebrow">RESULTADO DEL PAGO</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="he-checkout-dialog-actions">
          <Link className="he-button he-button-orange" href={isApproved ? '/menu2' : '/cart'}>
            {isApproved ? 'Volver al catálogo' : 'Volver al carrito'}
          </Link>
          {!isApproved && <Link className="he-button he-button-outline" href="/checkout">Intentar nuevamente</Link>}
        </div>
      </section>
    </main>
  );
}