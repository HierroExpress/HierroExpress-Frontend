'use client'
import RouteGuard from '@/helpers/routeGuard';
import AttributetList from '@/app/components/SuperAdminAttributes/attrubuteList';
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const AttributeListPage: React.FC = () => {
  return(
    <RouteGuard allowedRoles={['superadmin']}>
      <AdminShell><AttributetList /></AdminShell>
    </RouteGuard>
  );
};
export default AttributeListPage;
