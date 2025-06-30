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
    gridCols: string = 'grid-cols-3',
  ) => (
    <div className="flex flex-col h-full">
      <div className="golden-section-small flex items-center justify-center">
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center text-gray-800 leading-tight">
          {title}
        </h2>
      </div>
      <div className="golden-section-large flex-1 flex items-center justify-center p-2 sm:p-3 md:p-4">
        <div className={`grid ${gridCols} gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-full`}>
          {items.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center justify-center focus:outline-none group p-1 sm:p-2 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 relative mb-1 sm:mb-2 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-200 flex items-center justify-center">
                <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 relative">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    loading="lazy"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-all duration-300 group-hover:opacity-90 mix-blend-multiply p-0.5"
                  />
                </div>
              </div>
              <span className="text-[9px] sm:text-xs md:text-sm text-center text-gray-700 leading-tight max-w-full break-words font-medium">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-[#023047] to-blue-800 p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Contenedor principal con proporción áurea */}
      <div className="max-w-7xl mx-auto">
        {/* Hoja blanca centrada con sombras */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/30 border border-blue-100 overflow-hidden">
          {/* Header con gradiente sutil */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 py-4 sm:py-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 tracking-tight">
              CATEGORÍAS DE PRODUCTOS
            </h1>
            <div className="w-24 sm:w-32 md:w-40 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-2 sm:mt-3 rounded-full"></div>
          </div>
          
          {/* Contenido principal usando proporción áurea */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Grid principal con proporción áurea: 1.618:1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-8 md:mb-12">
              {/* Sección izquierda - Proporción áurea */}
              <div className="golden-rectangle bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {renderCategoryBlock('BARRAS Y PERFILES', grouped.materiales)}
              </div>
              
              {/* Sección derecha - Proporción áurea */}
              <div className="golden-rectangle bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {renderCategoryBlock('CHAPAS Y MALLAS', grouped.chapasYMallas)}
              </div>
            </div>
            
            {/* Sección inferior - Ancho completo con altura en proporción áurea */}
            <div className="golden-rectangle-wide bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {renderCategoryBlock(
                'INSUMOS Y ACCESORIOS',
                grouped.cosasChicas,
                'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'
              )}
            </div>
          </div>
        </div>
        
        {/* Decoración con elementos dorados */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full opacity-80"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
        </div>
      </div>
      
      <style jsx>{`
        /* Proporción áurea: φ = 1.618 */
        .golden-rectangle {
          aspect-ratio: 1.618 / 1;
          min-height: 200px;
        }
        
        .golden-rectangle-wide {
          aspect-ratio: 2.618 / 1; /* φ + 1 para secciones más anchas */
          min-height: 180px;
        }
        
        /* Subdivisión áurea interna */
        .golden-section-large {
          flex: 1.618;
        }
        
        .golden-section-small {
          flex: 1;
        }
        
        /* Efectos adicionales para el diseño áureo */
        @media (max-width: 640px) {
          .golden-rectangle {
            aspect-ratio: 1.2 / 1;
            min-height: 150px;
          }
          
          .golden-rectangle-wide {
            aspect-ratio: 1.8 / 1;
            min-height: 120px;
          }
        }
        
        @media (min-width: 1024px) {
          .golden-rectangle {
            aspect-ratio: 1.618 / 1;
            min-height: 250px;
          }
          
          .golden-rectangle-wide {
            aspect-ratio: 2.618 / 1;
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};