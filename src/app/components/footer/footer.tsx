import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="he-footer">
      <div className="he-container he-footer-main">
        <div>
          <Link href="/" className="he-brand">
            <img src="/HierroLogo.png" alt="" />
            <span>
              HIERRO
              <strong>
                EXPRESS<span>.</span>
              </strong>
            </span>
          </Link>
          <p>
            Venta de hierros e insumos para herrería.
            <br />
            Setembrino Pereda 3233, Montevideo.
          </p>
        </div>
        <div>
          <h3>Encontrá lo que necesitás</h3>
          <Link href="/menu2">Catálogo de productos</Link>
          <Link href="/aboutUs">Quiénes somos</Link>
          <Link href="/contact">Contactanos</Link>
        </div>
        <div>
          <h3>Seguimos en contacto</h3>
          <a
            href="https://www.instagram.com/hierroexpressuy/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/HierroExpressSA/"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://eshops.mercadolibre.com.uy/HIERROEXPRESS?skipInApp=true"
            target="_blank"
            rel="noreferrer"
          >
            Nuestra tienda en Mercado Libre
          </a>
        </div>
      </div>
      <div className="he-container he-footer-bottom">
        <span>
          © {new Date().getFullYear()} Hierro Express. Todos los derechos
          reservados.
        </span>
        <Link href="/policy-privacy">Política de privacidad</Link>
        <span></span>
      </div>
    </footer>
  );
}
