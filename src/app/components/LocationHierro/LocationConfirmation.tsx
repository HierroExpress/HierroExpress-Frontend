'use client';
import { useState } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';

const ZonaEntrega = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Centro de Montevideo para centrar el mapa
  const montevideoCenter = {
    lat: -34.9032,
    lng: -56.1882,
  };

  // Definir la zona de entrega (ejemplo: zona céntrica de Montevideo)
  const zonaEntregaCoords = [
    { lat: -34.8950, lng: -56.2100 }, // Norte-Oeste
    { lat: -34.8950, lng: -56.1650 }, // Norte-Este
    { lat: -34.9150, lng: -56.1650 }, // Sur-Este
    { lat: -34.9150, lng: -56.2100 }, // Sur-Oeste
  ];

  // Opciones de estilo para el polígono
  const polygonOptions = {
    fillColor: '#4CAF50',
    fillOpacity: 0.3,
    strokeColor: '#2E7D32',
    strokeOpacity: 1,
    strokeWeight: 2,
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Zona de Entrega - Montevideo</h2>
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          El área verde representa nuestra zona de entrega disponible.
        </p>
      </div>
      <div className="mb-4" style={{ height: '400px', width: '100%' }}>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          onLoad={handleMapLoad}
        >
          {isMapLoaded && (
            <GoogleMap
              center={montevideoCenter}
              zoom={13}
              mapContainerStyle={{ height: '100%', width: '100%' }}
            >
              <Polygon
                paths={zonaEntregaCoords}
                options={polygonOptions}
              />
            </GoogleMap>
          )}
        </LoadScript>
      </div>
      <div className="text-sm text-gray-500">
        <p>
          <span className="inline-block w-4 h-4 bg-green-400 opacity-50 mr-2"></span>
          Zona de entrega disponible
        </p>
      </div>
    </div>
  );
};

export default ZonaEntrega;
