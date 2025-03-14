'use client';
import { FaWhatsapp } from 'react-icons/fa';


export default function PopUpProvisional({ closePopup}:{closePopup: () => void}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Estamos en mantenimiento</h2>
        <p className="mb-4">
          Actualmente estamos subiendo productos y ajustando algunos detalles.
          ¡Con gusto te atenderemos por WhatsApp!
        </p>
        <a
          href="https://wa.me/+59898151680?text=Hola%20Hierro%20express,%20quiero%20más%20información%20de%20sus%20productos"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
        >
          <FaWhatsapp className="text-xl" />
          Contactar por WhatsApp
        </a>
        <button
          onClick={closePopup}
          className="mt-4 text-gray-500 hover:text-gray-700 underline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
