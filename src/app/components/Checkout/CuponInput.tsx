import React, { useState } from 'react';

interface CouponInputProps {
  onApplyCoupon: (couponCode: string) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyCoupon(couponCode);
    setCouponCode('');
  };

  return (
    <div className="mt-4 mb-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-blue-600 hover:text-blue-800 transition duration-300"
        >
          Ingresa tu cupón de descuento
        </button>
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Ingresar código de cupón"
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-600 transition duration-300"
            >
              Agregar cupón
            </button>
          </form>
          <button
            onClick={() => setIsOpen(false)}
            className="text-red-600 hover:text-red-800 transition duration-300 mt-2"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
