'use client'
import React from 'react';

import RouteGuard from '@/helpers/routeGuard';
import UsersList from '@/app/components/SuperAdminUsers/userList';
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const UserListPage: React.FC = () => {
  return(
    <RouteGuard allowedRoles={['superadmin', 'admin']}>
      <AdminShell><UsersList /></AdminShell>
    </RouteGuard>
  );
};
export default UserListPage;
