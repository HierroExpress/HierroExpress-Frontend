import Link from 'next/link';
import { ArrowRight, ArrowUpRight, FileText, MapPin, Ruler, Star, Truck } from 'lucide-react';

export default function Home() {
  return (
    <main className="he-home">
      <section className="he-hero-wrap he-home-slider" aria-label="Presentación de Hierro Express">
        <article className="he-home-slide he-home-slide-materials">
          <img src="/materiales/hero-acero-almacen-v2.png" alt="Perfiles y materiales de hierro en depósito" />
          <div className="he-home-slide-overlay" />
          <div className="he-container he-home-slide-content">
            <div className="he-banner-brand">
              <img src="/HierroExpressLogoOriginal.png" alt="Hierro Express" />
              <span>Materiales para herrería y construcción</span>
            </div>
            <h1 id="hero-title">20 años de experiencia.<span>Líderes en Mercado Libre.</span></h1>
            <p>Elija los materiales, confirme su pedido y gane tiempo: preparamos todo para retiro o entrega en obra.</p>
            <div className="he-actions">
              <Link className="he-hero-round-action he-hero-round-order" href="/menu2">
                <ArrowUpRight size={28} aria-hidden="true" />
                <span>Hacer<br />pedido</span>
              </Link>
              <Link className="he-hero-round-action he-hero-round-quote" href="/menu2?objetivo=presupuesto">
                <FileText size={25} aria-hidden="true" />
                <span>Pedir<br />presupuesto</span>
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="he-service-strip" role="list" aria-label="Servicios principales">
          <div className="he-service-item" role="listitem">
            <div className="he-service-icon" aria-hidden="true">
              <Truck size={24} />
            </div>
            <div className="he-service-text">
              <strong>Envíos rápidos en MVD</strong>
              <small>Coordinamos entrega a obra o retiro</small>
            </div>
          </div>
          <div className="he-service-divider" aria-hidden="true" />
          <div className="he-service-item" role="listitem">
            <div className="he-service-icon" aria-hidden="true">
              <Ruler size={24} />
            </div>
            <div className="he-service-text">
              <strong>Cortes a medida</strong>
              <small>Preparamos la longitud que indique</small>
            </div>
          </div>
          <div className="he-service-divider" aria-hidden="true" />
          <div className="he-service-item" role="listitem">
            <div className="he-service-icon" aria-hidden="true">
              <Star size={24} />
            </div>
            <div className="he-service-text">
              <strong>20 años de trayectoria</strong>
              <small>Atención para cada pedido y proyecto</small>
            </div>
          </div>
      </section>

      <section className="he-container he-home-information" id="empresa">
        <div>
          <p className="he-eyebrow">HIERRO EXPRESS</p>
          <h2>Materiales y atención para cada obra.</h2>
        </div>
        <p>Trabajamos con herrerías, constructoras y particulares. Nuestro equipo le ayuda a definir el material, las medidas y la forma de entrega antes de confirmar el pedido.</p>
        <a className="he-text-link" href="https://www.facebook.com/HierroExpressSA" target="_blank" rel="noreferrer">Conozca Hierro Express <ArrowRight size={18} aria-hidden="true" /></a>
      </section>

      <section id="como-comprar" className="he-container he-buy-help">
        <div className="he-buy-help-heading"><p className="he-eyebrow">SU PEDIDO, PASO A PASO</p><h2>Fácil de revisar antes de confirmar.</h2><p>Puede modificar cantidades, consultar el envío y pedir ayuda en cualquier momento.</p></div>
        <ol>
          <li><span>1</span><div><strong>Elija los materiales</strong><p>Vea las medidas y agregue solo lo que necesita.</p></div></li>
          <li><span>2</span><div><strong>Revise su carrito</strong><p>Corrija cantidades y confirme la entrega o el retiro.</p></div></li>
          <li><span>3</span><div><strong>Envíe el pedido</strong><p>Puede pagar con Mercado Pago o coordinar con nuestro equipo.</p></div></li>
        </ol>
        <Link className="he-button he-button-orange" href="/menu2">Ver materiales <ArrowRight size={21} aria-hidden="true" /></Link>
      </section>

      <section className="he-container he-location">
        <div><p className="he-eyebrow">ATENCIÓN Y RETIRO</p><h2>Visítenos en Montevideo</h2><p>Setembrino Pereda 3233. Le orientamos para elegir el material adecuado.</p></div>
        <div className="he-location-links"><a className="he-button he-button-outline" href="https://www.google.com/maps/search/?api=1&query=Setembrino+Pereda+3233+Montevideo" target="_blank" rel="noreferrer"><MapPin size={19} /> Ver ubicación</a><a className="he-text-link" href="https://www.google.com/maps/d/viewer?mid=1ZxdcJnurObNLbegwaRS8tOupeMsEcCU" target="_blank" rel="noreferrer">Ver zonas de entrega <ArrowRight size={18} aria-hidden="true" /></a></div>
      </section>
    </main>
  );
}
