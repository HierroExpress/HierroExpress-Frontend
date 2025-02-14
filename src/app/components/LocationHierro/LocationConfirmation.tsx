'use client';
import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const AlmacenLocation = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  
  const almacenLocation = {
    lat: -34.86889880349694, 
    lng: -56.16259826596687, 
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ubicación del Almacén</h2>
      <div className="mb-4" style={{ height: '400px', width: '100%' }}>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          onLoad={handleMapLoad}
        >
          {isMapLoaded && (
            <GoogleMap
              center={almacenLocation}
              zoom={17}
              mapContainerStyle={{ height: '100%', width: '100%' }}
            >
              <Marker position={almacenLocation} />
            </GoogleMap>
          )}
        </LoadScript>
      </div>
    </div>
  );
};

export default AlmacenLocation;
