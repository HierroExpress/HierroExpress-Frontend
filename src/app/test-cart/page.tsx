'use client';

import React, { useState } from 'react';
import ProductCard from '@/app/components/Cards/ProductCard';
import CartButtons from '@/app/components/ProductIdComponents/CartButtons';
import { Product } from '@/types';

// Mock product data for demonstration
const mockProduct: Product = {
  id: '1',
  name: 'Barra de Hierro 12mm',
  description: 'Barra de hierro de alta calidad de 12mm de diámetro',
  price: 150.00,
  img: 'https://via.placeholder.com/300x200.png?text=Barra+de+Hierro',
  category: [{ id: 1, name: 'Barras y Perfiles', icon: '', products: [], parentCategory: null, subcategories: [] }],
  stock: 100,
  isPopular: false
};

export default function TestCartPage() {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(Math.max(quantity - 1, 1));
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const addToCart = () => {
    console.log(`Adding ${quantity} items to cart`);
    alert(`¡${quantity} productos agregados al carrito!`);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Adding product to cart:', product);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Demo: Editable Quantity Inputs
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ProductCard Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              ProductCard Component (Menu2 Page)
            </h2>
            <p className="text-gray-600 mb-4">
              This shows how the editable quantity input appears in the product cards on the menu2 page.
              Click the input field and type any number!
            </p>
            <div className="max-w-xs mx-auto">
              <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* CartButtons Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              CartButtons Component (Product Detail Page)
            </h2>
            <p className="text-gray-600 mb-4">
              This shows how the editable quantity input appears on the product detail pages.
              You can type any number directly in the input field!
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{mockProduct.name}</h3>
                <p className="text-gray-600">${mockProduct.price.toFixed(2)}</p>
              </div>
              <CartButtons
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                addToCart={addToCart}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            New Features:
          </h3>
          <ul className="text-blue-700 space-y-2">
            <li>✓ Click on the quantity number to edit it directly</li>
            <li>✓ Type any number (e.g., 100) instead of clicking + multiple times</li>
            <li>✓ Visual styling makes it clear the input is editable</li>
            <li>✓ Automatic validation for positive integers only</li>
            <li>✓ Smooth hover and focus effects</li>
            <li>✓ Works with existing + and - buttons</li>
          </ul>
        </div>
      </div>
    </div>
  );
}