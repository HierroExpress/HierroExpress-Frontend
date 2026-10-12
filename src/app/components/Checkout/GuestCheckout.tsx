'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
interface Quote {
  items: {
    productId: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  mercadoPago: {
    currency: 'UYU';
    exchangeRate: number;
    total: number;
  } | null;
}
interface Receipt {
  id: string;
  subtotal: number;
  shippingCost: number;
  totalUyu: number | null;
}
interface ShippingQuote {
  shippingCost: number;
  canDeliver: boolean;
  shippingMessage: string;
  distance: number;
  totalUyu: number;
}
interface CheckoutAlert {
  title: string;
  message: string;
  needsMoreProducts?: boolean;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export default function GuestCheckout() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [checkoutAlert, setCheckoutAlert] = useState<CheckoutAlert | null>(null);
  const [shippingRetry, setShippingRetry] = useState(0);
  const [quotedShippingKey, setQuotedShippingKey] = useState('');
  const submitting = useRef(false);
  const requestId = useRef('');
  const shownShippingWarnings = useRef(new Set<string>());
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'coordinate'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'coordinate'>('mercadopago');
  const shippingAddressKey = `${contact.address.trim().toLowerCase()}|${contact.city.trim().toLowerCase()}`;
  const showCheckoutAlert = (message: string) => {
    const needsMoreProducts = message.includes('Compra mínima de $U 10.000 para envíos a más de 13 km.');
    setCheckoutAlert(needsMoreProducts
      ? { title: 'Falta monto para el envío', message: 'Compra mínima de $U 10.000 para envíos a más de 13 km.', needsMoreProducts: true }
      : { title: 'No fue posible continuar', message: 'Revisa los datos de entrega e inténtalo nuevamente. Si el problema continúa, elige pago a coordinar o comunícate con el local.' });
  };
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (!cart.length) {
          if (active)
            setError(
              'Tu carrito está vacío. Elegí productos antes de continuar.',
            );
          return;
        }
        const response = await fetch(
          `${API_URL}/orders/guest/quote`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart.map((item: { id: number; quantity: number }) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            }),
            signal: controller.signal,
          },
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            Array.isArray(data.message)
              ? data.message.join('. ')
              : data.message || 'No pudimos verificar los productos.',
          );
        if (active) setQuote(data);
      } catch (e) {
        if (active && !controller.signal.aborted)
          setError(
            e instanceof Error ? e.message : 'No pudimos cargar el pedido.',
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);
  useEffect(() => {
    if (deliveryMethod !== 'delivery' || !quote || contact.address.trim().length < 5 || contact.city.trim().length < 2) {
      setShippingQuote(null);
      setQuotedShippingKey('');
      setShippingError('');
      setShippingLoading(false);
      return;
    }
    let active = true;
    const requestedAddressKey = shippingAddressKey;
    setShippingLoading(true);
    setShippingQuote(null);
    const timeout = window.setTimeout(async () => {
      setShippingError('');
      try {
        const response = await fetch(`${API_URL}/orders/guest/shipping-quote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: contact.address,
            city: contact.city,
            items: quote.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(Array.isArray(data.message) ? data.message.join('. ') : data.message || 'No pudimos calcular el envío.');
        if (active) {
          setShippingQuote(data);
          setQuotedShippingKey(requestedAddressKey);
          if (!data.canDeliver && !shownShippingWarnings.current.has(requestedAddressKey)) {
            shownShippingWarnings.current.add(requestedAddressKey);
            showCheckoutAlert(data.shippingMessage);
          }
        }
      } catch (e) {
        if (active) {
          setShippingQuote(null);
          const message = e instanceof Error ? e.message : 'No pudimos calcular el envío.';
          setShippingError('No fue posible calcular el envío con esos datos.');
          if (!shownShippingWarnings.current.has(requestedAddressKey)) {
            shownShippingWarnings.current.add(requestedAddressKey);
            showCheckoutAlert(message);
          }
        }
      } finally {
        if (active) setShippingLoading(false);
      }
    }, 550);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [deliveryMethod, quote, contact.address, contact.city, shippingRetry, shippingAddressKey]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!quote || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const response = await fetch(
        `${API_URL}/orders/guest`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...contact,
            deliveryMethod,
            paymentMethod,
            requestId: requestId.current,
            items: quote.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            expectedSubtotal: quote.subtotal,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join('. ')
            : data.message || 'No pudimos guardar tu pedido.',
        );
      if (paymentMethod === 'mercadopago') {
        let payment: { initPoint?: string; message?: string } | null = null;
        let paymentError = 'No pudimos abrir Mercado Pago.';
        for (let attempt = 0; attempt < 2; attempt += 1) {
          try {
            const paymentResponse = await fetch(
              `${API_URL}/orders/guest/${requestId.current}/mercadopago`,
              { method: 'POST' },
            );
            const candidate = await paymentResponse.json() as { initPoint?: string; message?: string };
            payment = candidate;
            if (paymentResponse.ok && candidate.initPoint) break;
            paymentError = candidate.message || paymentError;
            if (paymentResponse.status < 500) break;
          } catch {
            // A short retry handles a transient API or connection failure.
          }
          if (attempt === 0) await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
        if (!payment?.initPoint) throw new Error(paymentError);
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new Event('cart:updated'));
        window.location.assign(payment.initPoint);
        return;
      }
      setReceipt(data);
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cart:updated'));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No pudimos guardar tu pedido.';
      console.error('Error al confirmar la compra:', message);
      setError('');
      showCheckoutAlert(message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };
  const contactComplete = contact.name.trim().length >= 2
    && contact.email.trim().length >= 3
    && contact.phone.trim().length >= 7;
  const shippingIsCurrent = quotedShippingKey === shippingAddressKey;
  const deliveryReady = deliveryMethod === 'coordinate'
    || Boolean(shippingQuote?.canDeliver && shippingIsCurrent && !shippingLoading);
  const canContinue = Boolean(quote && contactComplete && deliveryReady
    && !(paymentMethod === 'mercadopago' && !quote.mercadoPago));
  if (receipt)
    return (
      <main className="he-container he-checkout-page">
        <section className="he-cart-box" role="status">
          <h1>Recibimos tu pedido Nº {receipt.id}</h1>
          <p>Subtotal de productos: U$S {receipt.subtotal.toFixed(2)}.</p>
          {receipt.shippingCost > 0 && <p>Costo de envío: $U {receipt.shippingCost.toFixed(2)}.</p>}
          <p>
            La fecha de entrega y el pago se coordinan con el local. No se realizó ningún cobro.
          </p>
          <p>
            Guardá el número de pedido. Te contactaremos al teléfono que nos
            dejaste.
          </p>
          <Link className="he-button he-button-orange" href="/menu2">
            Volver a los productos
          </Link>
          <p>
            Si querés tener una cuenta,{' '}
            <Link className="he-text-link" href="/register">
              podés crearla acá
            </Link>
            . Es opcional.
          </p>
        </section>
      </main>
    );
  return (
    <main className="he-container he-checkout-page">
      <h1>Datos para tu compra y envío</h1>
      <p>No necesitás una cuenta ni contraseña para hacer el pedido.</p>
      {loading && <p role="status">Verificando productos y precios…</p>}
      {error && (
        <p role="alert" className="he-form-error">
          {error}
        </p>
      )}
      {checkoutAlert && (
        <div className="he-checkout-dialog-backdrop" role="presentation">
          <section className="he-checkout-dialog" role="alertdialog" aria-modal="true" aria-labelledby="checkout-alert-title">
            <p className="he-eyebrow">REVISÁ EL PEDIDO</p>
            <h2 id="checkout-alert-title">{checkoutAlert.title}</h2>
            <p>{checkoutAlert.message}</p>
            <div className="he-checkout-dialog-actions">
              {checkoutAlert.needsMoreProducts && <Link className="he-button he-button-orange" href="/menu2">Agregar productos</Link>}
              <button className="he-button he-button-outline" type="button" onClick={() => { setCheckoutAlert(null); if (checkoutAlert.needsMoreProducts) setShippingRetry((value) => value + 1); }}>Reintentar</button>
            </div>
          </section>
        </div>
      )}
      {quote && (
        <div className="he-checkout-layout">
          <form className="he-cart-box he-guest-form" onSubmit={submit}>
            <h2>¿A quién entregamos el pedido?</h2>
            {[
              {
                key: 'name',
                label: 'Nombre y apellido',
                auto: 'name',
                max: 50,
              },
              {
                key: 'email',
                label: 'Correo electrónico',
                auto: 'email',
                max: 254,
              },
              {
                key: 'phone',
                label: 'Teléfono o WhatsApp',
                auto: 'tel',
                max: 30,
              },
            ].map((field) => (
              <label key={field.key} htmlFor={`guest-${field.key}`}>
                {field.label}
                <input
                  id={`guest-${field.key}`}
                  name={field.key}
                  required
                  type={
                    field.key === 'email'
                      ? 'email'
                      : field.key === 'phone'
                        ? 'tel'
                        : 'text'
                  }
                  minLength={
                    field.key === 'phone' ? 7 : field.key === 'address' ? 5 : 2
                  }
                  maxLength={field.max}
                  autoComplete={field.auto}
                  value={contact[field.key as keyof typeof contact]}
                  onChange={(e) =>
                    setContact({ ...contact, [field.key]: e.target.value })
                  }
                />
              </label>
            ))}
            <fieldset className="he-choice-group">
              <legend>¿Cómo querés recibir tu pedido?</legend>
              <label className="he-choice">
                <input type="radio" name="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} />
                <span><strong>Envío a domicilio</strong><small>Indicá la dirección para calcular el costo antes de confirmar.</small></span>
              </label>
              <label className="he-choice">
                <input type="radio" name="delivery" checked={deliveryMethod === 'coordinate'} onChange={() => setDeliveryMethod('coordinate')} />
                <span><strong>Entrega a coordinar</strong><small>Coordinamos retiro en el local o el flete que necesites.</small></span>
              </label>
            </fieldset>
            {deliveryMethod === 'delivery' && <>
              <label htmlFor="guest-address">Calle, número y apartamento
                <input id="guest-address" required minLength={5} maxLength={250} autoComplete="street-address" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
              </label>
              <label htmlFor="guest-city">Ciudad o localidad
                <input id="guest-city" required minLength={2} maxLength={50} autoComplete="address-level2" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
              </label>
              <div className="he-map-help">
                <strong>¿Querés marcar la ubicación exacta?</strong>
                <p>Podés usar el mapa para mover el marcador y confirmar el punto de entrega.</p>
                <Link href="/address?from=checkout" className="he-text-link">Abrir mapa de entrega</Link>
              </div>
            </>}
            <fieldset className="he-choice-group">
              <legend>¿Cómo querés pagar?</legend>
              <label className="he-choice">
                <input type="radio" name="payment" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} />
                <span><strong>Mercado Pago</strong><small>Al confirmar, te llevamos a Mercado Pago para pagar de forma segura en pesos uruguayos.</small></span>
              </label>
              <label className="he-choice">
                <input type="radio" name="payment" checked={paymentMethod === 'coordinate'} onChange={() => setPaymentMethod('coordinate')} />
                <span><strong>Pago a coordinar</strong><small>Confirmamos contigo la forma de pago antes de entregar.</small></span>
              </label>
            </fieldset>
            <label htmlFor="guest-notes">
              Indicaciones para la entrega (opcional)
              <textarea
                id="guest-notes"
                maxLength={500}
                rows={3}
                value={contact.notes}
                onChange={(e) =>
                  setContact({ ...contact, notes: e.target.value })
                }
              />
            </label>
            <p>
              {deliveryMethod === 'delivery'
                ? shippingLoading ? 'Calculando costo de envío…' : shippingQuote?.shippingMessage || 'Completá la dirección para calcular el envío.'
                : 'Coordinaremos contigo el retiro o el flete.'}
            </p>
            {shippingError && <p className="he-form-error">{shippingError}</p>}
            <button
              className="he-button he-button-orange"
              type="submit"
              disabled={busy || !canContinue}
            >
              {busy
                ? 'Guardando pedido…'
                : paymentMethod === 'mercadopago'
                  ? 'Continuar a Mercado Pago'
                  : 'Confirmar pedido'}
            </button>
            {!busy && !canContinue && <p className="he-checkout-hint">Completá tus datos y la información de entrega para continuar.</p>}
            <p>
              Crear una cuenta es opcional.{' '}
              <Link href="/register" className="he-text-link">
                Crear cuenta
              </Link>
            </p>
          </form>
          <aside className="he-cart-box">
            <h2>Revisá tu pedido</h2>
            {quote.items.map((item) => (
              <div className="he-checkout-item" key={item.productId}>
                <strong>{item.name}</strong>
                <p>
                  {item.quantity} × U$S {item.price.toFixed(2)}
                </p>
                <p>U$S {item.total.toFixed(2)}</p>
              </div>
            ))}
            <h3>Subtotal: U$S {quote.subtotal.toFixed(2)}</h3>
            {deliveryMethod === 'delivery' && (
              <div className="he-shipping-summary" aria-live="polite">
                <strong>Envío a domicilio</strong>
                {shippingLoading && <span>Calculando distancia y costo…</span>}
                {!shippingLoading && shippingQuote && shippingIsCurrent && <><span>{shippingQuote.distance.toFixed(1)} km desde el local</span><strong>{shippingQuote.canDeliver ? `Envío: $U ${shippingQuote.shippingCost.toFixed(2)}` : shippingQuote.shippingMessage}</strong></>}
                {!shippingLoading && (!shippingQuote || !shippingIsCurrent) && <span>Completá calle y ciudad para ver el costo.</span>}
              </div>
            )}
            {paymentMethod === 'mercadopago' && quote.mercadoPago && (
              <div className="he-payment-conversion" aria-live="polite">
                <strong>Total para pagar: $U {(deliveryMethod === 'delivery' && shippingQuote && shippingIsCurrent ? shippingQuote.totalUyu : quote.mercadoPago.total).toFixed(2)}</strong>
                <span>Tipo de cambio aplicado: 1 U$S = $U {quote.mercadoPago.exchangeRate.toFixed(2)}</span>
              </div>
            )}
            {paymentMethod === 'mercadopago' && !quote.mercadoPago && (
              <p className="he-form-error">El pago con Mercado Pago todavía no está configurado. Elegí pago a coordinar o comunicate con nosotros.</p>
            )}
            <p>
              <strong>Entrega:</strong>{' '}
              {deliveryMethod === 'delivery' ? 'a domicilio.' : 'a coordinar con el local.'}
            </p>
            <p>
              <strong>Pago:</strong>{' '}
              {paymentMethod === 'mercadopago' ? 'Mercado Pago.' : 'a coordinar con el local.'}
            </p>
            <Link className="he-text-link" href="/cart">
              Modificar productos o cantidades
            </Link>
          </aside>
        </div>
      )}
      {!quote && !loading && (
        <Link className="he-button he-button-orange" href="/cart">
          Volver al carrito
        </Link>
      )}
    </main>
  );
}
