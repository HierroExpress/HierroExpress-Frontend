"use client"
import CheckoutSucess from '@/app/components/Checkout/CheckoutSuccess';
import RouteGuard from '@/helpers/routeGuard';
import React from 'react';


const success: React.FC = () => {


  return (
    <>
    <RouteGuard allowedRoles={['user']}>
      <CheckoutSucess />
    </RouteGuard>
    </>
  );
};

export default success;

