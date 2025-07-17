'use client';
import React from 'react';
import { Address, ProductsInOrder } from '@/types';
import StatusTracker from './StatusTracker';
import { HiTruck, HiCalendar, HiCreditCard, HiCash, HiShoppingBag, HiLocationMarker, HiX } from 'react-icons/hi';

interface OrderProps {
  order: Order;
  onCancelOrder?: (orderId: number) => void;
  onChangeAddress?: (orderId: number) => void;
}

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
    | 'En preparación'
    | 'Entregada';
  date: string;
}

const OrderDetails: React.FC<OrderProps> = ({ order, onCancelOrder, onChangeAddress }) => {
  const canCancelOrder = (status: string) => {
    return status === 'Pendiente' || status === 'Confirmada';
  };

  const canChangeAddress = (status: string) => {
    return status === 'Pendiente' || status === 'Confirmada';
  };

  const handleCancelOrder = () => {
    if (onCancelOrder && window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      onCancelOrder(order.id);
    }
  };

  const handleChangeAddress = () => {
    if (onChangeAddress) {
      onChangeAddress(order.id);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-500';
      case 'Confirmada':
        return 'bg-blue-500';
      case 'En preparación':
        return 'bg-orange-500';
      case 'En camino':
        return 'bg-purple-500';
      case 'Entregada':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentIcon = (formBuy: string) => {
    return formBuy === 'efectivo' ? (
      <HiCash className="inline mr-1" />
    ) : (
      <HiCreditCard className="inline mr-1" />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 border border-gray-100">
      {/* Header de la orden */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <HiTruck className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Pedido #{order.id}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <HiCalendar className="mr-1" />
              {new Date(order.date).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(order.status || 'Pendiente')}`}>
            {order.status || 'Pendiente'}
          </div>
        </div>
      </div>

      {/* StatusTracker siempre visible */}
      <div className="mb-6 bg-gray-700 rounded-xl p-4 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <StatusTracker status={order.status || 'Pendiente'} />
        </div>
      </div>
      {/* Productos */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <HiShoppingBag className="text-blue-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-800">Productos:</h4>
        </div>
        
        <div className="grid gap-3">
          {order.details.map((product, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="bg-blue-600 text-white rounded-lg px-3 py-1 mr-3 font-semibold">
                    {product.name}
                  </div>
                  <div className="bg-green-600 text-white rounded-lg px-3 py-1 text-sm">
                    Cantidad: {product.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información de pago y total */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <div className="flex items-center bg-blue-600 text-white rounded-lg px-3 py-2 inline-flex">
              {getPaymentIcon(order.formBuy)}
              <span className="font-semibold">
                Forma de pago: {order.formBuy === 'efectivo' ? 'Efectivo' : 'Tarjeta'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              Total: ${order.total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Dirección de entrega */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-semibold text-gray-300">
            Dirección de entrega:
          </h5>
          {canChangeAddress(order.status || 'Pendiente') && onChangeAddress && (
            <button
              onClick={handleChangeAddress}
              className="flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
              <HiLocationMarker className="mr-1" />
              Cambiar
            </button>
          )}
        </div>
        <p>{order.address.address}</p>
        {order.address.note && (
          <p className="text-gray-400 text-sm mt-1">
            Nota: {order.address.note}
          </p>
        )}
      </div>
        {(canCancelOrder(order.status || 'Pendiente') || canChangeAddress(order.status || 'Pendiente')) && (
        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="flex flex-col sm:flex-row gap-3">
            {canCancelOrder(order.status || 'Pendiente') && onCancelOrder && (
              <button
                onClick={handleCancelOrder}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
              >
                <HiX className="mr-2" />
                Cancelar pedido
              </button>
            )}
            
            {canChangeAddress(order.status || 'Pendiente') && onChangeAddress && (
              <button
                onClick={handleChangeAddress}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
              >
                <HiLocationMarker className="mr-2" />
                Cambiar dirección
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;