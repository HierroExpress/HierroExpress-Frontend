'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ConfirmLocationRedirectContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get all current search params and pass them to the address page
    const params = new URLSearchParams(searchParams.toString());
    const redirectUrl = `/address?${params.toString()}`;
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-900 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <p className="text-gray-700 text-xl">Redirigiendo...</p>
      </div>
    </div>
  );
};

const ConfirmLocationRedirect = () => (
  <Suspense fallback={
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-900 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <p className="text-gray-700 text-xl">Cargando...</p>
      </div>
    </div>
  }>
    <ConfirmLocationRedirectContent />
  </Suspense>
);

export default ConfirmLocationRedirect;