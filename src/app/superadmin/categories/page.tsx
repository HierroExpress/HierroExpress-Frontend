'use client'
import React from 'react';
import CategoryList from '@/app/components/SuperAdminCategory/categoryList';
import RouteGuard from '@/helpers/routeGuard';
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const categoryListPage: React.FC = () => {
  return(
      <RouteGuard allowedRoles={['superadmin']}>
      <AdminShell><CategoryList /></AdminShell>
      </RouteGuard>
  );
};

export default categoryListPage;
