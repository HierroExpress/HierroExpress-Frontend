'use client';
import { useState } from 'react';

const AlmacenLocation = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleIframeLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Zonas de Entrega - Montevideo y Área Metropolitana</h2>
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Consulta nuestras zonas de entrega disponibles en el mapa interactivo.
        </p>
        <p className="text-sm text-gray-500">
          Puedes hacer zoom y explorar cada zona para ver los detalles específicos.
        </p>
      </div>

      <div className="mb-4 relative overflow-hidden rounded-lg border border-gray-200" style={{ height: '500px', width: '100%' }}>
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}

        <iframe
          src="https://www.google.com/maps/d/embed?mid=1ZxdcJnurObNLbegwaRS8tOupeMsEcCU&ehbc=2E312F"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleIframeLoad}
          title="Mapa de Zonas de Entrega"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Información del Mapa</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Haz clic en las zonas coloreadas para ver detalles específicos</li>
          <li>• Usa los controles de zoom para explorar áreas específicas</li>
          <li>• Las diferentes zonas pueden tener tiempos de entrega distintos</li>
          <li>• Contacta con nosotros si tu ubicación no está clara en el mapa</li>
        </ul>
      </div>

      <div className="mt-4 text-center">
        <a
          href="https://www.google.com/maps/d/viewer?mid=1ZxdcJnurObNLbegwaRS8tOupeMsEcCU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Abrir mapa en pantalla completa
        </a>
      </div>
    </div>
  );
};

export default AlmacenLocation;