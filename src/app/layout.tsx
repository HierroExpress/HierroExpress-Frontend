import type { Metadata } from 'next';
// import { Poppins, Mochiy_Pop_One } from 'next/font/google';
import './globals.css';
import Footer from './components/footer/footer';
import { Navbar } from './components/NavBar/navBar';
import { AuthProvider } from './contexts/AuthContext';
import { CacheProvider } from './contexts/CacheContext';
import ToastProvider from './contexts/ToastProvider';
import ReactQueryProvider from './contexts/ReactQueryProvider';
import FloatingCart from './components/Cart/FloatingCart';
// import ChatBot from '@/components/ui/chatbot';

// const mochily = Mochiy_Pop_One({ weight: '400', subsets: ['latin'] });
// const poppins = Poppins({
//   weight: ['400', '500', '600', '700'],
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Hierro Express',
  description:
    'Hierros, perfiles e insumos para herrería y construcción en Montevideo. Materiales y atención personalizada desde 2006.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-UY" className="h-full w-full">
      <body className="flex flex-col min-h-screen w-full he-site">
        <AuthProvider>
          <CacheProvider>
            <Navbar />
            <ReactQueryProvider>
              <ToastProvider>
                {children}
                <FloatingCart />
              </ToastProvider>
            </ReactQueryProvider>
            <Footer />
          </CacheProvider>
        </AuthProvider>
        {/* <ChatBot /> */}
      </body>
    </html>
  );
}
