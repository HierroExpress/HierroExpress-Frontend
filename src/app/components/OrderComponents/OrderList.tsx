'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderDetails from './OrderItem';
import { Address, ProductsInOrder } from '@/types';
import { handleCancelOrder, handleUpdateOrderAddress } from './handlersOrders';
import { toast } from 'react-toastify';

interface Order {
  id: number;
  userId: number;
  address: Address;
  details: ProductsInOrder[];
  formBuy: 'efectivo' | 'tarjeta';
  total: number;
  status:
    | 'Pendiente'
    | 'Confirmada'
    | 'En camino'
    | 'Entregada'
    | 'En preparación';
  date: string;
}

interface OrderListProps {
  orders: Order[];
  onOrderUpdate?: () => void; // Callback to refresh orders after update
}

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderUpdate }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelOrderWithFeedback = async (orderId: number) => {
    setIsLoading(true);
    try {
      const result = await handleCancelOrder(orderId);
      
      if (result.success) {
        toast.success('Pedido cancelado exitosamente');
        // Refresh orders if callback provided
        if (onOrderUpdate) {
          onOrderUpdate();
        }
      } else {
        toast.error(result.error || 'Error al cancelar el pedido');
      }
    } catch (error) {
      toast.error('Error inesperado al cancelar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAddress = (orderId: number) => {
    router.push(`/confirm-location?orderId=${orderId}`);
  };

  return (
    <div className="mt-4">
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-red-500">
            Todavía no realizaste ningún pedido. ¡Tentate!
          </p>
          <button
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/menu2')}
          >
            Ir al Menú
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <OrderDetails
            key={order.id}
            order={order}
            onCancelOrder={handleCancelOrderWithFeedback}
            onChangeAddress={handleChangeAddress}
            isLoading={isLoading}
          />
        ))
      )}
    </div>
  );
};

export default OrderList;
