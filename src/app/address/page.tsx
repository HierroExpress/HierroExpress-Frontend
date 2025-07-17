'use client';
import { useEffect, useState, Suspense } from 'react';
import LocationConfirmation from '../components/Location/LocationConfirmation';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { Address } from '@/types';
import { HiLocationMarker, HiPlus, HiCheck } from 'react-icons/hi';

const ConfirmLocationPageContent = () => {
  const { user, setAddress, accessToken } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [showLocationConfirmation, setShowLocationConfirmation] =
    useState<boolean>(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const router = useRouter();
  const token = accessToken;
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const isUpdatingOrder = !!orderId;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses/user?id=${user?.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);

          // Preseleccionar la primera dirección si hay direcciones guardadas
          if (data.length > 0) {
            setSelectedAddressId(data[0].id);
          }
        } else {
          const errorData = await response.json();
          if (errorData.statusCode !== 404) {
            toast.error('Error al obtener las direcciones guardadas.');
          }
        }
      } catch (error) {
        console.error('Error al obtener las direcciones guardadas:', error);
        toast.error('Error al obtener las direcciones guardadas.');
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user, token]);

  const handleAddressSelect = (id: number) => {
    setSelectedAddressId(id);
  };

  const handleConfirmLocation = async () => {
    if (selectedAddressId) {
      const selectedAddress = addresses.find(
        (address) => address.id === selectedAddressId,
      );
      if (selectedAddress) {
        try {
          // Check if we're updating an order address
          const orderId = searchParams.get('orderId');
          
          if (orderId) {
            // Update order address
            const { handleUpdateOrderAddress } = await import('../components/OrderComponents/handlersOrders');
            const result = await handleUpdateOrderAddress(parseInt(orderId), selectedAddressId);
            
            if (result.success) {
              toast.success('Dirección del pedido actualizada exitosamente');
              router.push('/orders');
            } else {
              toast.error(result.error || 'Error al actualizar la dirección del pedido');
            }
          } else {
            // Normal address selection flow
            await setAddress(selectedAddress);

            const fromCheckout = searchParams.get('from') === 'checkout';

            if (fromCheckout) {
              // Si viene de checkout, volver a checkout
              router.push('/checkout');
            } else {
              // En cualquier otro caso, ir a la página principal
              router.push('/');
            }
          }
        } catch (error) {
          console.error('Error al establecer la dirección:', error);
          toast.error('Error al establecer la dirección.');
        }
      } else {
        toast.error('Dirección seleccionada no encontrada.');
      }
    } else {
      toast.error('Por favor selecciona una dirección.');
    }
  };

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(!isAddingNewAddress);
    setShowLocationConfirmation(!showLocationConfirmation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-900 w-full h-full p-4">
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl mx-auto">
          {!isAddingNewAddress && addresses.length > 0 ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <HiLocationMarker className="text-blue-600 text-3xl" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {isUpdatingOrder ? `Cambiar dirección del pedido #${orderId}` : 'Selecciona una dirección'}
                </h2>
                <p className="text-gray-600">
                  {isUpdatingOrder 
                    ? 'Selecciona una nueva dirección de entrega para tu pedido'
                    : 'Elige entre tus direcciones guardadas o agrega una nueva'
                  }
                </p>
                <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
              </div>

              {/* Lista de direcciones */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform ${
                      selectedAddressId === address.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                    onClick={() => handleAddressSelect(address.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">
                          <HiLocationMarker className="inline text-blue-600 mr-2" />
                          {address.address}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <strong>Nota:</strong> {address.note}
                        </p>
                      </div>
                      {selectedAddressId === address.id && (
                        <div className="bg-blue-600 text-white rounded-full p-1">
                          <HiCheck className="text-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="space-y-4">
                {selectedAddressId && (
                  <button
                    onClick={handleConfirmLocation}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <HiCheck className="inline mr-2" />
                    {isUpdatingOrder ? 'Actualizar dirección del pedido' : 'Confirmar ubicación'}
                  </button>
                )}
                
                <div className="text-center">
                  <span className="text-gray-500 text-sm">O agrega otra:</span>
                </div>
                
                <button
                  onClick={handleAddNewAddress}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <HiPlus className="inline mr-2" />
                  Agregar nueva dirección
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              {/* Header para sin direcciones */}
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <HiLocationMarker className="text-orange-600 text-3xl" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  No tienes direcciones guardadas
                </h2>
                <p className="text-gray-600">
                  Agrega tu primera dirección para continuar
                </p>
                <div className="w-20 h-1 bg-orange-600 mx-auto rounded-full mt-4"></div>
              </div>

              <button
                onClick={handleAddNewAddress}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <HiPlus className="inline mr-2" />
                {isAddingNewAddress ? 'Cerrar' : 'Agregar dirección'}
              </button>
            </div>
          )}

          {/* Componente de nueva dirección */}
          {isAddingNewAddress && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <LocationConfirmation />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmLocationPage = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-900 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <p className="text-gray-700 text-xl">Cargando...</p>
      </div>
    </div>
  }>
    <ConfirmLocationPageContent />
  </Suspense>
);

export default ConfirmLocationPage;