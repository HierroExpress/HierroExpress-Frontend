export const handleCancelOrder = async (orderId: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error cancelando pedido ${orderId}`);
    }

    console.log(`Pedido ${orderId} cancelado exitosamente`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
