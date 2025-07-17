import type { Metadata } from 'next';
import { Poppins, Mochiy_Pop_One } from 'next/font/google';
import './globals.css';
import Footer from './components/footer/footer';
import { Navbar } from './components/NavBar/navBar';
import { AuthProvider } from './contexts/AuthContext';
import { CacheProvider } from './contexts/CacheContext';
import ToastProvider from './contexts/ToastProvider';
import ReactQueryProvider from './contexts/ReactQueryProvider';
// import ChatBot from '@/components/ui/chatbot';

const mochily = Mochiy_Pop_One({ weight: '400', subsets: ['latin'] });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hierro Express',
  description: 'Hierro Express',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full w-full"
    >
      <body
        className={`${mochily.className} ${poppins.className} flex flex-col min-h-full w-full bg-gradient-to-br from-blue-900 via-[#023047] to-blue-800`}
      >
        <AuthProvider>
          <CacheProvider>
              <Navbar />
              <ReactQueryProvider>
                <ToastProvider>{children}</ToastProvider>
              </ReactQueryProvider>
              <Footer />
          </CacheProvider>
        </AuthProvider>
        {/* <ChatBot /> */}
      </body>
    </html>
  );
}