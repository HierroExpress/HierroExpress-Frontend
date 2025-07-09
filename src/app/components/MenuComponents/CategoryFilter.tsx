'use client';
import React from 'react';
import Image from 'next/image';
import { useCache } from '@/app/contexts/CacheContext';
import { useRouter } from 'next/navigation';

export const CategoryFilter = () => {
  const { categories } = useCache();
  const router = useRouter();

  const handleCategoryClick = (id: number) => {
    router.push(`/menu2/${id}`);
  };

  const materiales = ['CAÑOS', 'VIGAS', 'ANGULOS', 'TEE', 'PLANCHUELAS', 'VARILLAS'];
  const chapasYMallas = ['CHAPA', 'GALVANIZADA', 'MALLALUR', 'METAL DESPLEGADO', 'DESPLEGADO', 'PLANCHA'];
  const cosasChicas = ['PINTURAS', 'ELECTRODOS', 'DISCOS', 'CERRADURAS', 'INSUMOS', 'HERRAJES'];

  const filterByPrefix = (prefixes: string[]) => {
    const regexList = prefixes.map((prefix) => new RegExp(`^${prefix}`, 'i'));
    return (
      categories?.filter((cat) =>
        regexList.some((regex) => regex.test(cat.name.trim()))
      ) || []
    );
  };

  const grouped = {
    materiales: filterByPrefix(materiales),
    chapasYMallas: filterByPrefix(chapasYMallas),
    cosasChicas: filterByPrefix(cosasChicas),
  };

  const renderCategoryBlock = (title: string, items: any[], gridCols = 'grid-cols-3') => (
    <div className="flex flex-col h-full">
      <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center text-gray-800 mt-2 mb-2">{title}</h2>
      <div className={`grid ${gridCols} gap-3 p-2 sm:p-3 md:p-4`}>
        {items.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center justify-center p-1 sm:p-2 focus:outline-none group hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-orange-500 p-2 sm:p-3 md:p-4 lg:p-5 shadow hover:shadow-lg transition">
              <Image
                src={category.icon}
                alt={category.name}
                width={48}
                height={48}
                className="transition-all duration-300 group-hover:opacity-90 mix-blend-multiply p-0.5"
              />
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm text-center text-gray-700 mt-1 break-words max-w-[80px]">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center justify-start py-6 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800">CATEGORÍAS DE PRODUCTOS</h1>
          <div className="w-24 sm:w-32 md:w-40 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-2 rounded-full" />
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
              {renderCategoryBlock('BARRAS Y PERFILES', grouped.materiales)}
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
              {renderCategoryBlock('CHAPAS Y MALLAS', grouped.chapasYMallas)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
            {renderCategoryBlock('INSUMOS Y ACCESORIOS', grouped.cosasChicas, 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6')}
          </div>
        </div>
      </div>
    </div>
  );
};