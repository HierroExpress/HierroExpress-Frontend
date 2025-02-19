'use client';

import React, { useEffect, useState } from 'react';
import CustomModal from './modals';
import { useRouter } from 'next/navigation';
import CouponInput from './CuponInput';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

const SHIPPING_COST = 5.5;

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

const Checkout: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('efectivo');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const { accessToken, address } = useAuth();
  const token = accessToken;
  const calle = address?.address;

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
        setClientSecret(data.clientSecret);
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(order),
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

        // Guardar en localStorage
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/createPayment/mercadopago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: order.total,
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
    })
    const data = await response.json();
    console.log(data);
    window.location.href = data.init_point;
  }
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
          <span>$5.5</span>
        </div>
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
            ${(order.total + SHIPPING_COST).toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <span>Dirección:</span>
              <div className="flex justify-end mt-1">
                {' '}
                {/* Ajusta el margen superior según necesites */}
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
          className="w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
        >
          Pagar ahora
        </button>
      )}

      {selectedPaymentMethod === 'efectivo' && (
        <button
          onClick={() => handlePayment(true)}
          className="w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
        >
          Pagar ahora
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
