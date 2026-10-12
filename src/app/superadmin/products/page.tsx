'use client'
import React from 'react';
import ProductList from '@/app/components/SuperAdminProducts/productList';
import RouteGuard from '@/helpers/routeGuard';
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const ProductListPage: React.FC = () => {
  return(
    <RouteGuard allowedRoles={['superadmin', 'admin']}>
      <AdminShell><ProductList /></AdminShell>
    </RouteGuard>
  );
};
export default ProductListPage;
