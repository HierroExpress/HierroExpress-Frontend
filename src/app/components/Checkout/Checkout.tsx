'use client';

import React, { useEffect, useState } from 'react';
import CustomModal from './modals';
import { useRouter } from 'next/navigation';
import CouponInput from './CuponInput';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

//const STORE_ADDRESS = "Setembrino Pereda 3233, 11600 Montevideo, Departamento de Montevideo, Uruguay";

interface ProductsInOrder {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  userId: number;
  productsInOrder: ProductsInOrder[];
  orderInstructions?: string;
  address: number;
  total: number;
  couponId?: string | null;
  couponDiscount?: number;
  formBuy: 'efectivo' | 'tarjeta';
}

interface ShippingInfo {
  cost: number;
  distance: number;
  canDeliver: boolean;
  message?: string;
}

const Checkout: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('efectivo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    cost: 0,
    distance: 0,
    canDeliver: false
  });
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const { accessToken, address } = useAuth();
  const token = accessToken;
  const calle = address?.address;

  // Función para calcular el costo de envío según la lógica especificada
  const calculateShippingCost = (distance: number, orderTotal: number): ShippingInfo => {
    // Verificar si la distancia está dentro del rango de entrega (hasta 13 km)

    // DISTANCIA 1 - Hasta 2 km
    if (distance <= 2) {
      // Compra mínima: $1.000
      if (orderTotal < 1000) {
        return {
          cost: 0,
          distance,
          canDeliver: false,
          message: "Compra mínima de $1.000 para envíos hasta 2 km"
        };
      }
      
      // Envío gratis si supera $4.000
      if (orderTotal >= 4000) {
        return {
          cost: 0,
          distance,
          canDeliver: true,
          message: "Envío gratis"
        };
      }
      
      // Costo fijo de $500 si no supera $4.000
      return {
        cost: 500,
        distance,
        canDeliver: true
      };
    }

    // DISTANCIA 2 - Más de 2 km hasta 9 km
    if (distance > 2 && distance <= 9) {
      // Compra mínima: $2.000
      if (orderTotal < 2000) {
        return {
          cost: 0,
          distance,
          canDeliver: false,
          message: "Compra mínima de $2.000 para envíos entre 2-9 km"
        };
      }
      
      // Envío gratis si supera $6.000
      if (orderTotal >= 6000) {
        return {
          cost: 0,
          distance,
          canDeliver: true,
          message: "Envío gratis"
        };
      }
      
      // Cálculo según tramos y montos
      if (orderTotal >= 1000 && orderTotal < 2500) {
        return {
          cost: distance <= 5 ? 600 : 800,
          distance,
          canDeliver: true
        };
      }
      
      if (orderTotal >= 2500 && orderTotal < 3500) {
        return {
          cost: distance <= 5 ? 600 : 700,
          distance,
          canDeliver: true
        };
      }
      
      if (orderTotal >= 3500 && orderTotal < 4500) {
        return {
          cost: 600,
          distance,
          canDeliver: true
        };
      }
      
      if (orderTotal >= 4500 && orderTotal < 6000) {
        return {
          cost: 500,
          distance,
          canDeliver: true
        };
      }
    }

    // DISTANCIA 3 - Más de 9 km hasta 13 km
    if (distance > 9 && distance <= 13) {
      // Compra mínima: $2.000
      if (orderTotal < 2000) {
        return {
          cost: 0,
          distance,
          canDeliver: false,
          message: "Compra mínima de $2.000 para envíos entre 9-13 km"
        };
      }
      
      // Envío gratis si supera $8.000
      if (orderTotal >= 8000) {
        return {
          cost: 0,
          distance,
          canDeliver: true,
          message: "Envío gratis"
        };
      }
      
      // Cálculo según montos
      if (orderTotal >= 2000 && orderTotal < 4000) {
        return { cost: 800, distance, canDeliver: true };
      }
      if (orderTotal >= 4000 && orderTotal < 5000) {
        return { cost: 700, distance, canDeliver: true };
      }
      if (orderTotal >= 5000 && orderTotal < 6000) {
        return { cost: 600, distance, canDeliver: true };
      }
      if (orderTotal >= 6000 && orderTotal < 8000) {
        return { cost: 500, distance, canDeliver: true };
      }
    }

    // Caso por defecto (no debería llegar aquí)
    // DISTANCIA 4 - Más de 13 km
if (distance > 13) {
  // Compra mínima: $10.000
  if (orderTotal < 10000) {
    return {
      cost: 0,
      distance,
      canDeliver: false,
      message: "Compra mínima de $10.000 para envíos a más de 13 km"
    };
  }

  // Calcular costo base: km * $58
  let cost = Math.ceil(distance * 58);

  // Aplicar redondeo según monto:
  if (cost <= 1500) {
    cost = Math.ceil(cost / 50) * 50;
  } else {
    cost = Math.ceil(cost / 100) * 100;
  }

  // Verificar zonas especiales de peaje
  const lowerCaseAddress = calle?.toLowerCase() || '';

  if (lowerCaseAddress.includes('jaureguiberry') || lowerCaseAddress.includes('peaje de pando') || lowerCaseAddress.includes('costa de oro')) {
    // Costa de Oro: agregar $500 por peaje
    cost += 500;
  }

  // Ciudad de la Costa no suma peaje
  // Pero si necesitas identificarla, puedes hacerlo así:
  // if (lowerCaseAddress.includes('solymar') || lowerCaseAddress.includes('el pinar') || lowerCaseAddress.includes('ciudad de la costa')) {
  //   // No agregar peaje
  // }

  return {
    cost,
    distance,
    canDeliver: true,
    message: "Entrega con flete particular a coordinar"
  };
}
    return {
      cost: 0,
      distance,
      canDeliver: false,
      message: "Error al calcular el envío"
    };
  };

  // Función para obtener la distancia usando el endpoint del backend
  const calculateDistance = async (destinationAddress: string): Promise<number> => {
    try {
      // Llamar al endpoint del backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-maps/calculate-distance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinationAddress: destinationAddress
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al calcular la distancia');
      }
      
      const data = await response.json();
      const distanceKm = data.distanceInKm > 1000 ? data.distanceInKm / 1000 : data.distanceInKm;

      return distanceKm; // Ya viene en kilómetros
      
    } catch (error) {
      console.error('Error calculando distancia:', error);
      
      // Fallback: usar coordenadas aproximadas para Montevideo
      // Esto es un cálculo muy básico solo como backup
      const storeCoords = { lat: -34.9011, lng: -56.1645 };
      
      // Estimar distancia basada en zona de Montevideo
      // Esto es solo un estimado muy básico
      if (destinationAddress.toLowerCase().includes('centro') || 
          destinationAddress.toLowerCase().includes('ciudad vieja')) {
        return 3; // Aproximadamente 3 km al centro
      } else if (destinationAddress.toLowerCase().includes('pocitos') || 
                 destinationAddress.toLowerCase().includes('punta carretas')) {
        return 6; // Aproximadamente 6 km a la costa
      } else if (destinationAddress.toLowerCase().includes('malvin') || 
                 destinationAddress.toLowerCase().includes('buceo')) {
        return 8; // Aproximadamente 8 km al este
      } else {
        return 5; // Distancia promedio por defecto
      }
    }
  };

  // Calcular costo de envío cuando cambie la orden o la dirección
  useEffect(() => {
    const calculateShipping = async () => {
      if (!order || !calle) return;
      
      setIsLoadingShipping(true);
      
      try {
        const distance = await calculateDistance(calle);
        const shipping = calculateShippingCost(distance, order.total);
        setShippingInfo(shipping);
      } catch (error) {
        console.error('Error calculating shipping:', error);
        setShippingInfo({
          cost: 0,
          distance: 0,
          canDeliver: false,
          message: "Error al calcular el envío"
        });
      } finally {
        setIsLoadingShipping(false);
      }
    };

    calculateShipping();
  }, [order, calle]);

  useEffect(() => {
    const storedOrder = localStorage.getItem('order');
    const storedCouponDiscount = localStorage.getItem('couponDiscount');

    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);

      if (storedCouponDiscount) {
        const { discount: discountPercentage, couponCode } =
          JSON.parse(storedCouponDiscount);
        const discountAmount = (parsedOrder.total * discountPercentage) / 100;

        setOrder({
          ...parsedOrder,
          couponDiscount: discountPercentage,
          couponId: couponCode,
          total: parsedOrder.total - discountAmount,
        });

        setCouponDiscount(discountPercentage);
      } else {
        setOrder(parsedOrder);
      }
    }
  }, []);

  useEffect(() => {
    if (order) {
      const amount = order.total * 1000;

      const fetchClientSecret = async () => {
        console.log('este es el monto:', amount);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
          },
        );
        const data = await response.json();
        console.log(data);
      };

      fetchClientSecret();
    }
  }, [order]);

  if (!order) {
    return <p>Cargando...</p>;
  }

  const handlePaymentMethodChange = (method: 'efectivo' | 'tarjeta') => {
    if (!order) return;

    setOrder((prevOrder) => {
      if (!prevOrder) return prevOrder;

      return {
        ...prevOrder,
        formBuy: method,
      };
    });
    setSelectedPaymentMethod(method);
  };

  const handlePayment = async (success: boolean) => {
    try {
      if (!order) return;
      if (!success) {
        throw new Error('Error al enviar la orden.');
      }

      // Verificar si se puede realizar el envío
      if (!shippingInfo.canDeliver) {
        setModalType('error');
        setModalMessage(shippingInfo.message || 'No se puede realizar el envío a esta dirección.');
        setIsModalOpen(true);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...order,
            shippingCost: shippingInfo.cost,
            distance: shippingInfo.distance
          }),
        },
      );
      
      console.log('esta es la order:', order);
      
      if (!response.ok) {
        throw new Error('Error al enviar la orden.');
      }

      localStorage.removeItem('couponDiscount');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('order');

      setModalType('success');
      setModalMessage('Pedido realizado con éxito!');
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setModalType('error');
      setModalMessage('Algo falló al procesar el pago.');
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        router.push('/checkout');
      }, 3000);
    }
  };

  const handleApplyCoupon = async (couponCode: string) => {
    if (!order) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/discount/invalid?code=${encodeURIComponent(couponCode)}&userId=${order.userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Error al validar el cupón');
      }

      const data = await response.json();

      if (data.isValid) {
        const discountPercentage = data.discount;
        const discountAmount = (order.total * discountPercentage) / 100;

        const discountData = {
          discount: discountPercentage,
          couponCode,
        };

        localStorage.setItem('couponDiscount', JSON.stringify(discountData));

        setCouponDiscount(discountPercentage);
        setOrder((prevOrder) => {
          if (!prevOrder) return prevOrder;

          return {
            ...prevOrder,
            couponDiscount: discountPercentage,
            couponId: couponCode,
            total: prevOrder.total - discountAmount,
          };
        });
        setModalType('success');
        setModalMessage('Cupón aplicado con éxito!');
      } else {
        throw new Error('Cupón no válido');
      }
    } catch (error) {
      console.error('Error al aplicar el cupón:', error);
      setModalType('error');
      setModalMessage('Cupón no válido o expirado.');
    } finally {
      setIsModalOpen(true);
    }
  };

  const generateLinkMercadoPago = async () => {
    if (!shippingInfo.canDeliver) {
      setModalType('error');
      setModalMessage(shippingInfo.message || 'No se puede realizar el envío a esta dirección.');
      setIsModalOpen(true);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/createPayment/mercadopago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        amount: order.total + shippingInfo.cost,
        userId: order.userId,
        items: order.productsInOrder.map((item) => {
          return {
            title: item.name,
            quantity: item.quantity,
            currency_id: 'ARS',
            unit_price: item.price
          }
        })
      })
    });
    
    const data = await response.json();
    console.log(data);
    window.location.href = data.init_point;
  };

  const finalTotal = order.total + shippingInfo.cost;

  return (
    <div className="max-w-full mx-auto bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
      <div className="mb-4">
        {order.productsInOrder.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span>{item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <div className="flex justify-between">
          <span>Costos de entrega:</span>
          <span>
            {isLoadingShipping ? (
              "Calculando..."
            ) : !shippingInfo.canDeliver ? (
              <span className="text-red-500">No disponible</span>
            ) : shippingInfo.cost === 0 ? (
              <span className="text-green-500">Gratis</span>
            ) : (
              `$${shippingInfo.cost.toFixed(2)}`
            )}
          </span>
        </div>
        
        {shippingInfo.distance > 0 && (
          <div className="text-sm text-gray-500">
            Distancia: {shippingInfo.distance.toFixed(1)} km
          </div>
        )}
        
        {shippingInfo.message && (
          <div className={`text-sm mt-1 ${shippingInfo.canDeliver ? 'text-green-600' : 'text-red-600'}`}>
            {shippingInfo.message}
          </div>
        )}
        
        <CouponInput onApplyCoupon={handleApplyCoupon} />
        
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuento del cupón:</span>
            <span>-{couponDiscount.toFixed(2)}%</span>
          </div>
        )}
        
        <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 mt-1">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span>Dirección:</span>
              <div className="flex justify-end mt-1">
                <Link href={'/address?from=checkout'} className="text-blue-500">
                  Cambiar dirección
                </Link>
              </div>
            </div>
            <span>{calle}</span>
          </div>
          Tiempo estimado: 1 - 3 días
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Métodos de pago</h2>
      <div className="space-y-2 mb-4">
        <div
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
            selectedPaymentMethod === 'efectivo'
              ? 'border-black'
              : 'border-gray-300'
          }`}
          onClick={() => handlePaymentMethodChange('efectivo')}
        >
          <div className="w-8 h-8 mr-4 bg-green-500 rounded-full flex items-center justify-center text-white">
            $
          </div>
          <div>
            <h3 className="font-semibold">Efectivo</h3>
          </div>
          {selectedPaymentMethod === 'efectivo' && (
            <div className="ml-auto">
              <div className="w-4 h-4 rounded-full border-2 border-black"></div>
            </div>
          )}
        </div>
      </div>
      
      <div
        className={`flex items-center p-4 border rounded-lg cursor-pointer ${
          selectedPaymentMethod === 'tarjeta'
            ? 'border-black'
            : 'border-gray-300'
        }`}
        onClick={() => handlePaymentMethodChange('tarjeta')}
      >
        <div className="w-8 h-8 mr-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
          💳
        </div>
        <div>
          <h3 className="font-semibold">Mercado Pago (Tarjeta)</h3>
        </div>
        {selectedPaymentMethod === 'tarjeta' && (
          <div className="ml-auto">
            <div className="w-4 h-4 rounded-full border-2 border-black"></div>
          </div>
        )}
      </div>

      {selectedPaymentMethod === 'tarjeta' && (
        <button
          onClick={() => generateLinkMercadoPago()}
          disabled={!shippingInfo.canDeliver || isLoadingShipping}
          className={`w-full text-white text-center py-3 rounded-lg transition duration-300 mt-4 ${
            !shippingInfo.canDeliver || isLoadingShipping
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoadingShipping ? 'Calculando envío...' : 'Pagar ahora'}
        </button>
      )}

      {selectedPaymentMethod === 'efectivo' && (
        <button
          onClick={() => handlePayment(true)}
          disabled={!shippingInfo.canDeliver || isLoadingShipping}
          className={`w-full text-white text-center py-3 rounded-lg transition duration-300 mt-4 ${
            !shippingInfo.canDeliver || isLoadingShipping
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoadingShipping ? 'Calculando envío...' : 'Pagar ahora'}
        </button>
      )}
      
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default Checkout;