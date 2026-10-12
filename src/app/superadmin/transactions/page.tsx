'use client'
import React from "react";
import TransactionInfoPage from "@/app/components/SuperAdminStripe/TransactionList";
import RouteGuard from "@/helpers/routeGuard";
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const CreateProductPage: React.FC = () => {
  return(
      <RouteGuard allowedRoles={['superadmin']}>
    <AdminShell><TransactionInfoPage /></AdminShell>
      </RouteGuard>
  );
};

export default CreateProductPage;
