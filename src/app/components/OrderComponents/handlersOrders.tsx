import { getCookie } from 'cookies-next';

export const handleCancelOrder = async (orderId: number) => {
  try {
    const accessToken = getCookie('accessToken');
    
    if (!accessToken) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error cancelando pedido ${orderId}`);
    }

    console.log(`Pedido ${orderId} cancelado exitosamente`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

export const handleUpdateOrderAddress = async (orderId: number, addressId: number) => {
  try {
    const accessToken = getCookie('accessToken');
    
    if (!accessToken) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/address`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ addressId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error actualizando dirección del pedido ${orderId}`);
    }

    console.log(`Dirección del pedido ${orderId} actualizada exitosamente`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};
