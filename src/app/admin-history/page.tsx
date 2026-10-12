import RouteGuard from '@/helpers/routeGuard';
import { HistoryOrders } from '../components/AdminProfile/historyOrders';
import { AdminShell } from '@/app/components/SuperAdmin/AdminShell';

const page: React.FC = () => {
  return (
    <RouteGuard allowedRoles={['admin', 'superadmin']}>
      <AdminShell><HistoryOrders /></AdminShell>
    </RouteGuard>
  );
};

export default page;
