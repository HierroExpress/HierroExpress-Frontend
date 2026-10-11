import Link from 'next/link';
export default function AboutUs() {
  return (
    <main className="he-container he-content-page">
      <p className="he-eyebrow">HIERRO EXPRESS · DESDE 2006</p>
      <h1>
        Barraca de hierros
        <br />
        en Montevideo desde 2006.
      </h1>
      <p className="he-intro">
        Somos una barraca de hierros en el centro de Montevideo. Desde 2006
        acompañamos a herreros, emprendedores y particulares con materiales,
        experiencia y una atención cercana.
      </p>
      <div className="he-content-grid">
        <section className="he-content-box">
          <h2>Productos de herrería y construcción</h2>
          <p>
            Caños, barras, perfiles, vigas, chapas, mallas e insumos. Nuestro
            objetivo es que encuentres lo que necesitás de manera rápida, fácil
            y confiable.
          </p>
          <Link className="he-button he-button-orange" href="/menu2">
            Conocé nuestro catálogo
          </Link>
        </section>
        <section className="he-content-box">
          <h2>Cortes y entregas</h2>
          <p>
            Te asesoramos para elegir los materiales de tu trabajo. Realizamos
            cortes transversales en barras y coordinamos retiros, fletes y
            encomiendas según tu proyecto.
          </p>
          <Link className="he-button he-button-orange" href="/contact">
            Consultar por cortes y envíos
          </Link>
        </section>
      </div>
    </main>
  );
}
