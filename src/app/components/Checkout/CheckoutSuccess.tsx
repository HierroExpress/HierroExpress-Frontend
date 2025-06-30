

import { useCallback, useEffect, useState } from "react";
import CustomModal from "./modals";
import { useRouter } from "next/navigation";

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

function CheckoutSuccess() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const router = useRouter();

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

        } else {
        setOrder(parsedOrder);
      }
    }
  }, []);
  const token = localStorage.getItem('token');
const handlePayment = useCallback(async (success: boolean) => {
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
}, [order, token, router]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const success = queryParams.get('success');

    if (success === 'true') {
      setIsModalOpen(true);
      setModalMessage('Thank you for your purchase!');
      setModalType('success');
      handlePayment(true)
      setTimeout(() => {
        router.push('/orders')
      }, 3000);
    } else if (success === 'pending') {
      setIsModalOpen(true);
      setModalMessage('El pago está Pendiente, por favor, verifica el pago o contactate con el soporte');
      setModalType('error');
    } else {
      setIsModalOpen(true);
      setModalMessage('El pago fue cancelado, vuelve a intentarlo');
      setModalType('error');
    }
  }, [router, handlePayment]);
  return (
    <div>
        <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
}

export default CheckoutSuccess;