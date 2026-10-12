'use client'
import React from "react";
import ProductCreate from "@/app/components/SuperAdminProducts/productCreate";
import RouteGuard from "@/helpers/routeGuard";
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const CreateProductPage: React.FC = () => {
  return(
      <RouteGuard allowedRoles={['superadmin']}>
    <AdminShell><ProductCreate /></AdminShell>
      </RouteGuard>
  );
};

export default CreateProductPage;
