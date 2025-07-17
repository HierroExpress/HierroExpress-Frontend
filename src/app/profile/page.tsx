'use client';
import React from 'react';
import UserInfo from '../components/ProfileComponents/UserInfo';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/ProductIdComponents/BackButton';
import { HiChevronRight } from 'react-icons/hi';
import Link from 'next/link';

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading, isAdmin, isSuperAdmin } = useAuth();
  const isGoogleUser = user?.googleAuth ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-500 to-blue-900 w-full h-full">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <p className="text-gray-700 text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-500 to-blue-900 w-full h-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <p className="text-red-600 text-xl font-semibold">
            Usuario no autenticado. Por favor inicie sesión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-900 w-full h-full p-4">
      <BackButton className="mb-6" />
      
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-auto">
          {/* Header de la tarjeta */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Información del usuario */}
          <div className="mb-8">
            {user ? (
              <UserInfo user={user} />
            ) : (
              <div className="text-center text-gray-600">Cargando...</div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="space-y-4">
            {!isAdmin() && !isSuperAdmin() && (
              <>
                <Link href="/address" passHref>
                  <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <span className="text-lg font-semibold">Mis direcciones</span>
                    <HiChevronRight className="text-xl" />
                  </div>
                </Link>
                
                <Link href="/orders" passHref>
                  <div className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <span className="text-lg font-semibold">Mis Pedidos</span>
                    <HiChevronRight className="text-xl" />
                  </div>
                </Link>
              </>
            )}
            
            {!isGoogleUser && (
              <Link href="/change-password" passHref>
                <div className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <span className="text-lg font-semibold">Cambiar contraseña</span>
                  <HiChevronRight className="text-xl" />
                </div>
              </Link>
            )}
          </div>

          {/* Footer de la tarjeta */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              Gestiona tu cuenta y preferencias desde aquí
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;