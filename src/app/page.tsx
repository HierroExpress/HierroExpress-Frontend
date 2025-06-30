'use client';
import { CategoryFilter } from '../app/components/MenuComponents/CategoryFilter';
import { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import AlmacenLocation from './components/LocationHierro/LocationConfirmation';
import { FaWhatsapp } from "react-icons/fa"; 
import { FiFilter } from "react-icons/fi"; 
import Link from 'next/link';
import PopUpProvisional from '@/components/ui/popUpProvisional';

export default function Home() {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

   const closePopup = () => {
     setShowPopup(false);
   };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <link rel="icon" href="/HierroLogo.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Contenedor principal sin restricciones de ancho */}
      <div className="min-h-screen w-full">
        <main className="w-full px-4 py-4 lg:px-8 xl:px-12 2xl:px-16">
          <CategoryFilter />
          
          {/* Contenedor de botones con mejor distribución */}
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
            {/* Filter Menu Button */}
            <Link
              href="/menu2"
              className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-3xl 
                         w-full md:flex-1 md:max-w-xs flex items-center justify-center"
            >
              <FiFilter />
            </Link>
            
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/+59898654665"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors text-3xl 
                         w-full md:flex-1 md:max-w-xs flex items-center justify-center"
            >
              <FaWhatsapp />
            </a>
          </div>

          {/* Componente de ubicación con ancho completo */}
          <div className="w-full max-w-6xl mx-auto">
            <AlmacenLocation />
          </div>
          
          {/* Botón de scroll to top */}
{showScrollTopButton && (
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
  >
    <IoIosArrowUp className="text-2xl" />
  </button>
)}

          
          {/* WhatsApp Button fijo */}
          <a
            href="https://wa.me/+59898151680?text=Hola%20Hierro%20express,%20quiero%20más%20información%20de%20sus%20productos"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 left-8 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
          >
            <FaWhatsapp className="text-2xl" />
          </a>
          
          {/* Filter Menu Button fijo */}
          <button
            className="fixed bottom-20 left-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
          >
            <Link
            href="/menu2">
            <FiFilter className="text-2xl" />
            </Link>
          </button>
        </main>
      </div>

      {showPopup && <PopUpProvisional closePopup={closePopup} />}
    </>
  );
}