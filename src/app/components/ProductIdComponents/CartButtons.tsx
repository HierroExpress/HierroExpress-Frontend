import React from 'react';

export default function CartButtons({
  quantity,
  onIncrease,
  onDecrease,
  addToCart,
  onQuantityChange,
}: {
  quantity: any;
  onIncrease: any;
  onDecrease: any;
  addToCart: any;
  onQuantityChange?: (value: number) => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input for better UX while typing
    if (value === '') {
      onQuantityChange?.(0);
      return;
    }
    
    const numValue = parseInt(value);
    
    // Only allow positive integers
    if (!isNaN(numValue) && numValue >= 0) {
      onQuantityChange?.(numValue);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onDecrease}
        className="bg-blue-600 text-white rounded-full p-2 mr-4"
      >
        -
      </button>
      <div className="flex items-center">
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="w-16 h-10 text-center text-lg font-semibold border-2 border-blue-300 rounded-md focus:border-blue-500 focus:outline-none bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
          min="0"
          placeholder="0"
          title="Click to edit quantity"
        />
      </div>
      <button
        onClick={onIncrease}
        className="bg-blue-600 text-white rounded-full p-2 ml-4"
      >
        +
      </button>
      <div className="ml-4 flex-grow">
        <button
          onClick={addToCart}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 w-full white-space:nowrap"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
