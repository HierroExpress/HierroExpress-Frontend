'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import OrderDetails from './OrderItem';
import { Address, ProductsInOrder } from '@/types';
import { handleCancelOrder } from './handlersOrders';

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
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  const router = useRouter();

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
            onCancelOrder={handleCancelOrder}
            onChangeAddress={handleChangeAddress}
          />
        ))
      )}
    </div>
  );
};

export default OrderList;
