'use client';
import { Popular } from '../app/components/HomeComponents/Popular';
import { CategoryFilter } from '../app/components/MenuComponents/CategoryFilter';
import Horarios from './components/HomeComponents/Horarios';
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
      <div className="w-full flex justify-center">
        <main className="w-full flex-grow p-4">
          <CategoryFilter />
          <Horarios />
          <Popular />
          {/* opcion uno  */}
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-6">
            {/* Filter Menu Button (large, blue) */}
            <Link
              href="/menu2"
              className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-3xl w-full md:w-auto"
              // onClick={scrollToFilters}
            >
              <FiFilter />
            </Link>
            {/* WhatsApp Button (large, green) */}
            <a
              href="https://wa.me/+59898654665" // Replace with the actual WhatsApp number (e.g., +1234567890)
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors text-3xl w-full md:w-auto"
            >
              <FaWhatsapp />
            </a>
          </div>

          {/* opcion uno  */}
          <AlmacenLocation />
          {/* <RenderCategory /> */}
          {showScrollTopButton && (
            <Link
              href="/menu2"
              className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
            >
              <IoIosArrowUp className="text-2xl" />
            </Link>
          )}
          {/* WhatsApp Button (bottom-left corner, fixed) */}
          <a
            href="https://wa.me/+59898151680?text=Hola%20Hierro%20express,%20quiero%20más%20información%20de%20sus%20productos"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 left-8 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
          >
            <FaWhatsapp className="text-2xl" />
          </a>
          {/* Filter Menu Button (bottom-left, above WhatsApp or adjust position) */}
          <button
            className="fixed bottom-20 left-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
            // onClick={scrollToFilters}
          >
            <FiFilter className="text-2xl" />
          </button>
        </main>
      </div>

      {showPopup && <PopUpProvisional closePopup={closePopup} />}
    </>
  );
}
