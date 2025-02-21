'use client'
import RouteGuard from '@/helpers/routeGuard';
import AttributetList from '@/app/components/SuperAdminAttributes/attrubuteList';

const AttributeListPage: React.FC = () => {
  return(
    <RouteGuard allowedRoles={['superadmin']}>
      <div className="w-full flex flex-col items-center justify-start min-h-screen bg-white p-4">
      <div className="mt-4 w-full">
      <AttributetList />
        </div>
        
        <h1>Atributos</h1>
  </div>
    </RouteGuard>
  );
};
export default AttributeListPage;