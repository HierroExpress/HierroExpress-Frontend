import Link from 'next/link';
import { ArrowRight, MapPin, Ruler, ShieldCheck, Truck } from 'lucide-react';
import { CategoryFilter } from './components/MenuComponents/CategoryFilter';

export default function Home() {
  return (
    <main className="he-home">
      <section className="he-hero-wrap">
      <div className="he-container he-hero">
        <div className="he-hero-copy">
          <p className="he-eyebrow">HIERROS Y MATERIALES PARA CONSTRUIR</p>
          <h1>Materiales para cada etapa de tu obra.</h1>
          <p className="he-hero-description">Consulta medidas, agrega productos y conoce el costo de envío antes de confirmar tu pedido.</p>
          <div className="he-actions">
            <Link className="he-button he-button-orange" href="/menu2">
              Explorar catálogo <ArrowRight size={21} aria-hidden="true" />
            </Link>
            <Link className="he-button he-button-outline" href="#como-comprar">Ver cómo comprar</Link>
          </div>
          <p className="he-hero-proof">
            <ShieldCheck size={19} aria-hidden="true" /> Puedes comprar sin crear una cuenta.
          </p>
        </div>
        <div className="he-hero-art">
          <div className="he-hero-art-label"><span>CATÁLOGO PARA TU PROYECTO</span><strong>Caños, perfiles y chapas</strong></div>
          <img src="/materiales/canos.jpeg" alt="Caño rectangular de acero" className="he-hero-material" />
        </div>
      </div></section>
      <section className="he-container he-service-strip" aria-label="Información de compra">
        <div><Truck aria-hidden="true" /><span><strong>Envío calculado</strong><small>Indica tu dirección y conoce el costo.</small></span></div>
        <div><Ruler aria-hidden="true" /><span><strong>Medidas disponibles</strong><small>Revisa cada opción antes de agregarla.</small></span></div>
        <div><MapPin aria-hidden="true" /><span><strong>Retiro o entrega</strong><small>Elige la alternativa más conveniente.</small></span></div>
      </section>
      <section className="he-container he-catalog-section" id="catalogo">
        <div className="he-section-heading">
          <div>
            <p className="he-eyebrow">CATÁLOGO DE MATERIALES</p><h2>Elige el material que necesitas</h2>
            <p className="he-section-description">
              Selecciona una categoría para ver productos, medidas y precios.
            </p>
          </div>
          <Link className="he-text-link" href="/menu2">
            Ver catálogo completo <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <CategoryFilter />
      </section>
      <section id="como-comprar" className="he-container he-buy-help">
        <div className="he-buy-help-heading"><p className="he-eyebrow">PEDIDO EN LÍNEA</p><h2>Compra en tres pasos</h2><p>No necesitas crear una cuenta para realizar un pedido.</p></div>
        <ol>
          <li><span>1</span><div><strong>Elige el material</strong><p>Revisa medidas, precio y disponibilidad antes de agregarlo.</p></div></li>
          <li><span>2</span><div><strong>Indica la entrega</strong><p>Escribe tu dirección y consulta el costo de envío.</p></div></li>
          <li><span>3</span><div><strong>Confirma el pedido</strong><p>Paga con Mercado Pago o solicita coordinación.</p></div></li>
        </ol>
        <Link className="he-button he-button-orange" href="/menu2">
          Ir al catálogo <ArrowRight size={21} aria-hidden="true" />
        </Link>
      </section>
      <section className="he-container he-location">
        <div>
          <p className="he-eyebrow">ATENCIÓN Y RETIRO</p><h2>Visítanos en Montevideo</h2>
          <p>Setembrino Pereda 3233. Podemos orientarte para elegir el material adecuado.</p>
        </div>
        <div className="he-location-links">
          <a className="he-button he-button-outline" href="https://www.google.com/maps/search/?api=1&query=Setembrino+Pereda+3233+Montevideo" target="_blank" rel="noreferrer">Ver ubicación</a>
          <a className="he-text-link" href="https://www.google.com/maps/d/viewer?mid=1ZxdcJnurObNLbegwaRS8tOupeMsEcCU" target="_blank" rel="noreferrer">Ver zonas de entrega <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
      </section>
    </main>
  );
}
