import Link from 'next/link';
import { ArrowRight, CircleHelp, MapPin, Ruler, Truck } from 'lucide-react';
import { CategoryFilter } from './components/MenuComponents/CategoryFilter';

export default function Home() {
  return (
    <main className="he-home">
      <section className="he-hero-wrap he-hero-photo">
        <div className="he-container he-hero he-hero-photo-content">
          <div className="he-hero-copy">
            <p className="he-eyebrow">HIERRO EXPRESS · MONTEVIDEO</p>
            <h1>Todo el hierro que necesita su proyecto.</h1>
            <p className="he-hero-description">Elija un tipo de material, revise las medidas y arme su pedido con tranquilidad.</p>
            <div className="he-actions">
              <Link className="he-button he-button-orange" href="#catalogo">
                Elegir materiales <ArrowRight size={21} aria-hidden="true" />
              </Link>
              <Link className="he-button he-button-outline" href="/menu2?objetivo=presupuesto">Pedir presupuesto</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="he-container he-service-strip" aria-label="Ayuda para comprar">
        <div><Truck aria-hidden="true" /><span><strong>Envío o retiro</strong><small>Elija la forma más conveniente.</small></span></div>
        <div><Ruler aria-hidden="true" /><span><strong>Medidas claras</strong><small>Revise cada opción antes de sumar.</small></span></div>
        <div><CircleHelp aria-hidden="true" /><span><strong>¿Tiene dudas?</strong><small>Le ayudamos a elegir el material.</small></span></div>
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
