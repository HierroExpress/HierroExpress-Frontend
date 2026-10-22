import React from 'react';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Truck, 
  FileText, 
  Send,
  Grid,
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* 3. HERO BANNER */}
      <section className="relative bg-slate-900 text-white min-h-[380px] md:min-h-[420px] flex items-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/materiales/hero-acero-almacen-v2.png" 
            alt="Hierros y perfiles" 
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Elegí los materiales. <br />
              <span className="text-amber-400">Armá tu pedido.</span>
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-300">
              Preparamos todo para retiro o entrega en obra.
            </p>
</div>

            {/* BOTONES RESPONSIVOS (Rectangulares en PC, Circulares en móvil) */}
    <div className="mt-8 flex items-center justify-center md:justify-start gap-6 md:gap-4">

  {/* Botón 1: Pedir presupuesto */}
  <Link
    href="/menu2?objetivo=presupuesto"
    className="flex flex-col md:flex-row items-center justify-center text-center md:text-left
      bg-white text-slate-900 border border-slate-200 shadow-md
      hover:shadow-lg hover:border-amber-300 hover:bg-amber-50/50
      transition-all duration-200
      w-[144px] h-[144px] shrink-0 rounded-full p-3
      md:w-auto md:h-auto md:rounded-xl md:px-7 md:py-5"
  >
    <FileText className="w-10 h-10 md:w-6 md:h-6 text-amber-500 mb-2 md:mb-0 md:mr-3 shrink-0" />

    <div>
      <div className="font-bold text-xs md:text-base leading-tight">
        Pedir presupuesto
      </div>

      <div className="text-xs text-slate-500 hidden md:block mt-1">
        Descargalo en PDF
      </div>
    </div>
  </Link>

  {/* Botón 2: Hacer pedido */}
  <Link
    href="/menu2"
    className="flex flex-col md:flex-row items-center justify-center text-center md:text-left
      bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold
      shadow-md hover:shadow-lg hover:-translate-y-0.5
      transition-all duration-200
      w-[144px] h-[144px] shrink-0 rounded-full p-3
      md:w-auto md:h-auto md:rounded-xl md:px-8 md:py-5"
  >
    <Truck className="w-10 h-10 md:w-6 md:h-6 mb-2 md:mb-0 md:mr-3 shrink-0" />

    <span className="text-xs md:text-base leading-tight">
      Hacer pedido
    </span>
  </Link>

</div>
        </div>
      </section>

      {/* 4. BLOQUES DE SERVICIOS / BENEFICIOS */}
<section className="max-w-7xl mx-auto px-4 py-4 md:py-8 w-full flex flex-col gap-3 md:gap-4">

  {/* Banner 1 */}
  <div className="group w-full rounded-xl overflow-hidden shadow-sm border border-slate-700/40 
                  transition-all duration-500 ease-out 
                  hover:-translate-y-1 hover:shadow-xl hover:border-slate-500/50 cursor-pointer">
    <Image
      src="/Banner_1.png"
      alt="Envíos a todo Montevideo"
      width={0}
      height={0}
      sizes="100vw"
      priority
      className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.015]"
    />
  </div>

  {/* Banner 2 */}
  <div className="group w-full rounded-xl overflow-hidden shadow-sm border border-slate-700/40 
                  transition-all duration-500 ease-out 
                  hover:-translate-y-1 hover:shadow-xl hover:border-slate-500/50 cursor-pointer">
    <Image
      src="/Banner_2.png"
      alt="Hacemos cortes en el momento"
      width={0}
      height={0}
      sizes="100vw"
      className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.015]"
    />
  </div>

  {/* Banner 3 */}
  <div className="group w-full rounded-xl overflow-hidden shadow-sm border border-slate-700/40 
                  transition-all duration-500 ease-out 
                  hover:-translate-y-1 hover:shadow-xl hover:border-slate-500/50 cursor-pointer">
    <Image
      src="/Banner_3.png"
      alt="Destacados en Mercado Libre"
      width={0}
      height={0}
      sizes="100vw"
      className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.015]"
    />
  </div>

</section>
      {/* 5. PASOS DE PEDIDO */}
      <section className="max-w-4xl mx-auto px-4 py-8 text-center w-full">
        <h2 className="text-lg md:text-2xl font-extrabold text-[#0b283d] mb-6">
          Hacé tu pedido en 3 pasos
        </h2>
        
        <div className="flex items-center justify-between relative max-w-xl mx-auto">
          {/* Paso 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-500 mb-2">
              <Grid className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-700">1. Elegís<br/>los materiales</p>
          </div>

          <div className="border-t-2 border-dotted border-slate-300 w-8 md:w-16 -mt-6"></div>

          {/* Paso 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-500 mb-2">
              <ShoppingCart className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-700">2. Revisás<br/>el carrito</p>
          </div>

          <div className="border-t-2 border-dotted border-slate-300 w-8 md:w-16 -mt-6"></div>

          {/* Paso 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-500 mb-2">
              <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-700">3. Confirmás<br/>el pedido</p>
          </div>
        </div>
      </section>

{/* 6. UBICACIÓN / MAPA */}
<section className="max-w-7xl mx-auto px-4 py-6 w-full">
  <div className="mb-3">
    <h2 className="text-lg md:text-2xl font-bold text-[#0b283d]">
      Encontranos
    </h2>
    <p className="text-sm text-slate-500 mt-1">
      Hierro Express · Nuestra ubicación
    </p>
  </div>

  <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3273.4935157876243!2d-56.16517508761803!3d-34.868951671442666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f80631130a295%3A0xb16f7469e2a9a0cf!2sHierro%20Express!5e0!3m2!1ses-419!2sar!4v1792523366382!5m2!1ses-419!2sar"
      className="absolute inset-0 w-full h-full"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Ubicación de Hierro Express en Google Maps"
    />

    <a
      href="https://www.google.com/maps/dir/?api=1&destination=Hierro+Express&destination_place_id=0xb16f7469e2a9a0cf"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-3 right-3 inline-flex items-center gap-2
        bg-white text-[#0b283d] font-bold text-sm px-4 py-3
        rounded-lg shadow-lg border border-slate-200
        hover:bg-amber-50 transition-colors"
    >
      <Send className="w-4 h-4 text-amber-500" />
      Cómo llegar
    </a>
  </div>
</section>

      {/* 7. FOOTER */}
      <footer className="bg-[#0b283d] text-white py-4 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider">HIERRO EXPRESS</span>
            <span className="text-slate-400">| Desde 2006</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <Instagram className="w-4 h-4 cursor-pointer hover:text-amber-400" />
            <Facebook className="w-4 h-4 cursor-pointer hover:text-amber-400" />
            <span className="font-bold text-xs cursor-pointer hover:text-amber-400">TikTok</span>
            <Youtube className="w-4 h-4 cursor-pointer hover:text-amber-400" />
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
<div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
  <div className="bg-white text-slate-800 text-xs px-3 py-1 rounded-full shadow-lg font-medium border border-slate-100 hidden sm:block">
    ¿En qué te ayudamos?
  </div>

  <a
    href="https://wa.me/59898151680"
    target="_blank"
    rel="noreferrer"
    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
  >
    <span className="font-bold text-xl">
      <FaWhatsapp />
    </span>
  </a>
</div>
    </div>
  );
}