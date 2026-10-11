export default function Contact() {
  return (
    <main className="he-container he-content-page">
      <p className="he-eyebrow">ATENCIÓN PERSONALIZADA</p>
      <h1>
        Consultas sobre productos
        <br />
        y entregas.
      </h1>
      <p className="he-intro">
        Contanos qué material necesitás, las medidas y la cantidad. Nuestro
        equipo te ayuda a encontrar la mejor opción y coordinar la entrega o el
        retiro.
      </p>
      <div className="he-content-grid">
        <section className="he-content-box">
          <h2>Hablemos por WhatsApp.</h2>
          <p>
            Consultá por productos, cortes y entregas. Si tenés una lista de
            materiales, compartila con nuestro equipo.
          </p>
          <a
            className="he-button he-button-orange"
            href="https://wa.me/59898151680?text=Hola%20Hierro%20Express,%20necesito%20asesoramiento%20para%20mi%20proyecto."
            target="_blank"
            rel="noreferrer"
          >
            Abrir WhatsApp
          </a>
        </section>
        <section className="he-content-box">
          <h2>Acercate a nuestro local.</h2>
          <p>
            Setembrino Pereda 3233
            <br />
            Montevideo, Uruguay
          </p>
          <a
            className="he-button he-button-orange"
            href="https://www.google.com/maps/search/?api=1&query=Setembrino+Pereda+3233+Montevideo"
            target="_blank"
            rel="noreferrer"
          >
            Cómo llegar
          </a>
        </section>
      </div>
    </main>
  );
}
