export default function CategoryNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-[#023047] to-blue-800">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Categoría no encontrada</h1>
        <p className="text-xl text-white/80 mb-6">
          Lo sentimos, la categoría que buscas no existe o ha sido movida.
        </p>
        <div className="space-y-4">
          <a
            href="/menu2"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Ver todas las categorías
          </a>
          <br />
          <a
            href="/"
            className="inline-block text-white/80 hover:text-white underline transition-colors duration-200"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}