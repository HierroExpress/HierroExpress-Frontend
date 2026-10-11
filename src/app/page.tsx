import Link from 'next/link';
import { CategoryFilter } from './components/MenuComponents/CategoryFilter';

export default function Home() {
  return (
    <main className="he-home">
      <section className="he-hero he-container">
        <div className="he-hero-copy">
          <p className="he-eyebrow">HIERRO EXPRESS · MONTEVIDEO</p>
          <h1>
            Comprá hierros e insumos
            <br />
            para tu obra o taller.
          </h1>
          <p className="he-hero-description">
            Elegí el producto y la cantidad. Agregalos al carrito y completá tus datos para coordinar el envío.
          </p>
          <div className="he-actions">
            <Link className="he-button he-button-orange" href="/menu2">
              Ver productos y comprar
            </Link>
            <Link className="he-text-link" href="/contact">
              Consultar antes de comprar
            </Link>
          </div>
          <p className="he-hero-proof">
            Barraca de hierros en Montevideo desde 2006.
          </p>
        </div>
        <div className="he-hero-art">
          <img
            src="/materiales/canos.jpeg"
            alt="Caño rectangular de acero"
            className="he-hero-material"
          />
          <p className="he-photo-label">Caños, barras y perfiles de acero</p>
        </div>
      </section>
      <section className="he-container he-catalog-section" id="catalogo">
        <div className="he-section-heading">
          <div>
            <h2>¿Qué necesitás comprar?</h2>
            <p className="he-section-description">
              Elegí un tipo de producto para ver sus medidas y precios.
            </p>
          </div>
          <Link className="he-text-link" href="/menu2">
            Ver todos los productos
          </Link>
        </div>
        <CategoryFilter />
      </section>
      <section className="he-container he-buy-help">
        <h2>Cómo comprar con envío</h2>
        <ol>
          <li>
            <strong>1. Elegí tus productos</strong>
            <p>
              Buscá el material, revisá la medida y agregá la cantidad al
              carrito.
            </p>
          </li>
          <li>
            <strong>2. Completá tus datos</strong>
            <p>
              Escribí tu nombre, teléfono y dirección de entrega. No necesitás una cuenta.
            </p>
          </li>
          <li>
            <strong>3. Confirmá tu pedido</strong>
            <p>
              Revisá los productos. Coordinaremos con vos el costo del envío y el pago.
            </p>
          </li>
        </ol>
        <Link className="he-button he-button-orange" href="/menu2">
          Empezar mi compra
        </Link>
        <p>
          Si necesitás cortes o consultar una entrega,{' '}
          <Link href="/contact">contactanos antes de comprar</Link>.
        </p>
      </section>
      <section className="he-container he-location">
        <div>
          <h2>Retiro en nuestro local</h2>
          <p>Setembrino Pereda 3233, Montevideo.</p>
        </div>
        <div className="he-location-links">
          <a className="he-text-link" href="https://www.google.com/maps/search/?api=1&query=Setembrino+Pereda+3233+Montevideo" target="_blank" rel="noreferrer">Ver ubicación del local</a>
          <a className="he-text-link" href="https://www.google.com/maps/d/viewer?mid=1ZxdcJnurObNLbegwaRS8tOupeMsEcCU" target="_blank" rel="noreferrer">Ver zonas de entrega en el mapa</a>
        </div>
      </section>
    </main>
  );
}
