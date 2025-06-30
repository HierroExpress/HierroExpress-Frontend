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
  
  const materiales = [
    'CAÑOS',
    'VIGAS',
    'ANGULOS',
    'TEE',
    'PLANCHUELAS',
    'VARILLAS',
  ];
  
  const chapasYMallas = [
    'CHAPA',
    'GALVANIZADA',
    'MALLALUR',
    'METAL DESPLEGADO',
    'DESPLEGADO',
    'PLANCHA',
  ];
  
  const cosasChicas = [
    'PINTURAS',
    'ELECTRODOS',
    'DISCOS',
    'CERRADURAS',
    'INSUMOS',
    'HERRAJES',
  ];
  
  const filterByPrefix = (prefixes: string[]) => {
    const regexList = prefixes.map((prefix) => new RegExp(`^${prefix}`, 'i'));
    return (
      categories?.filter((cat) =>
        regexList.some((regex) => regex.test(cat.name.trim())),
      ) || []
    );
  };
  
  const grouped = {
    materiales: filterByPrefix(materiales),
    chapasYMallas: filterByPrefix(chapasYMallas),
    cosasChicas: filterByPrefix(cosasChicas),
  };
  
  const renderCategoryBlock = (
    title: string,
    items: any[],
    isFullWidth: boolean = false,
  ) => (
    <div className={isFullWidth ? 'col-span-full' : ''}>
      <h2 className="text-sm sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-center text-gray-800">
        {title}
      </h2>
      <div
        className={
          isFullWidth
            ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4'
            : 'grid grid-cols-3 gap-1 sm:gap-3 md:gap-4'
        }
      >
        {items.map((category) => (
          <button
            key={category.id}
            className="flex flex-col items-center focus:outline-none group p-1 sm:p-2"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 relative mb-1 sm:mb-2 rounded-full bg-orange-400 overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95">
              <Image
                src={category.icon}
                alt={category.name}
                loading="lazy"
                width={400}
                height={400}
                style={{ objectFit: 'cover' }}
                className="transition-opacity duration-300 group-hover:opacity-80 p-1 sm:p-3 md:p-4 mix-blend-multiply"
              />
            </div>
            <span className="text-[10px] sm:text-sm md:text-base text-center text-gray-600 leading-tight max-w-full break-words hyphens-auto">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="w-full p-3 sm:p-6 md:p-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
        {renderCategoryBlock('BARRAS Y PERFILES', grouped.materiales)}
        {renderCategoryBlock('CHAPAS Y MALLAS', grouped.chapasYMallas)}
      </div>
      
      <div className="mt-4 sm:mt-6 md:mt-8">
        {renderCategoryBlock('INSUMOS Y ACCESORIOS', grouped.cosasChicas, true)}
      </div>
    </div>
  );
};