import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CircleHelp, FileText, MapPin, Ruler, Truck } from 'lucide-react';
import { CategoryFilter } from './components/MenuComponents/CategoryFilter';

export default function Home() {
  return (
    <main className="he-home">
      <section className="he-hero-wrap" aria-labelledby="hero-title">
        {/* Capa de fondo con fotografía industrial */}
        <div className="he-hero-bg" aria-hidden="true">
          <img src="/materiales/hero-acero-almacen-v2.png" alt="" className="he-hero-bg-img" />
          <div className="he-hero-gradient" />
        </div>

        {/* Elemento decorativo geométrico industrial */}
        <div className="he-hero-geometry" aria-hidden="true">
          <div className="he-geometry-bar he-geometry-bar-1" />
          <div className="he-geometry-bar he-geometry-bar-2" />
          <div className="he-geometry-bar he-geometry-bar-3" />
          <div className="he-geometry-accent" />
        </div>

        <div className="he-container he-hero">
          <div className="he-hero-copy">
            <div className="he-hero-brand-lockup">
              <img src="/HierroExpressLogoOriginal.png" alt="Hierro Express" />
              <span>Materiales para herrería y construcción</span>
            </div>
            <h1 id="hero-title" className="he-hero-title">
              Materiales para<br /><span className="he-hero-title-accent">su proyecto.</span>
            </h1>
            <p className="he-hero-description">
              Elija el material, revise las medidas y prepare su pedido.
            </p>
            <div className="he-actions">
              <Link className="he-hero-round-action he-hero-round-order" href="#catalogo">
                <ArrowUpRight size={28} aria-hidden="true" />
                <span>Hacer<br />pedido</span>
              </Link>
              <Link className="he-hero-round-action he-hero-round-quote" href="/menu2?objetivo=presupuesto">
                <FileText size={25} aria-hidden="true" />
                <span>Pedir<br />presupuesto</span>
              </Link>
            </div>
          </div>

          {/* Showcase de materiales - tarjeta visual premium */}
          <div className="he-hero-showcase" aria-hidden="true">
            <div className="he-showcase-frame">
              <div className="he-showcase-grid" />
              <div className="he-showcase-materials">
                <img src="/materiales/vigas.jpeg" alt="Vigas estructurales" className="he-showcase-img he-showcase-img-1" loading="eager" />
                <img src="/materiales/canos.jpeg" alt="Caños estructurales" className="he-showcase-img he-showcase-img-2" loading="eager" />
                <img src="/materiales/planchuelas.jpeg" alt="Planchuelas y perfiles" className="he-showcase-img he-showcase-img-3" loading="eager" />
              </div>
              <div className="he-showcase-overlay">
                <div className="he-showcase-label">
                  <span className="he-showcase-tag">MATERIALES EN STOCK</span>
                  <strong>Catálogo técnico disponible</strong>
                </div>
                <div className="he-showcase-cta">
                  <Link href="#catalogo" className="he-showcase-link">
                    Explorar catálogo completo
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="he-showcase-corner" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="31" height="31" rx="2" stroke="#f49b22" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="he-showcase-shadow" aria-hidden="true" />
          </div>
        </div>

        {/* Franja de servicios integrada al hero */}
        <div className="he-service-strip" role="list" aria-label="Servicios principales">
          <div className="he-service-item" role="listitem">
            <div className="he-service-icon" aria-hidden="true">
              <Truck size={24} />
            </div>
            <div className="he-service-text">
              <strong>Envío a obra o retiro</strong>
              <small>Coordinamos la logística que necesite</small>
            </div>
          </div>
          <div className="he-service-divider" aria-hidden="true" />
          <div className="he-service-item" role="listitem">
            <div className="he-service-icon" aria-hidden="true">
              <Ruler size={24} />
            </div>
            <div className="he-service-text">
              <strong>Medidas exactas</strong>
              <small>Cortamos a la longitud que indique</small>
            </div>
          </div>
          <div className="he-service-divider" aria-hidden="true" />
          <div className="he-service-item" role="listitem">
            <div className="he-service-icon" aria-hidden="true">
              <CircleHelp size={24} />
            </div>
            <div className="he-service-text">
              <strong>Asesoramiento técnico</strong>
              <small>Le ayudamos a elegir el perfil correcto</small>
            </div>
          </div>
        </div>
      </section>

      <section className="he-container he-catalog-section" id="catalogo">
        <div className="he-section-heading">
          <div>
            <p className="he-eyebrow">EMPIECE POR AQUÍ</p>
            <h2>¿Qué material busca?</h2>
            <p className="he-section-description">Seleccione un panel para ver productos, medidas y precios.</p>
          </div>
          <Link className="he-text-link" href="/menu2">Ver todo el catálogo <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <CategoryFilter />
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
