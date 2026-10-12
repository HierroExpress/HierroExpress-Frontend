'use client'
import React from "react";
import CategoryCreate from "@/app/components/SuperAdminCategory/categoryCreate";
import RouteGuard from "@/helpers/routeGuard";
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const CreateCategoryPage: React.FC = () => {
  return(
      <RouteGuard allowedRoles={['superadmin']}>
    <AdminShell><CategoryCreate /></AdminShell>
      </RouteGuard>
  );
};

export default CreateCategoryPage;
