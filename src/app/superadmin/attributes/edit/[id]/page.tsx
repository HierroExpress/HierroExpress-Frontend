'use client'
import React from 'react';
import AttributeEdit from '@/app/components/SuperAdminAttributes/attributeEdit';
import RouteGuard from '@/helpers/routeGuard';

interface EditAttributePageProps {
  params: { id: string };
}

const EditAttributePage: React.FC<EditAttributePageProps> = ({ params }) => {
  const { id } = params;

  return (
    <RouteGuard allowedRoles={['superadmin']}>
      <div className="container mx-auto p-4">
        <AttributeEdit attributeId={id} />
      </div>
    </RouteGuard>
  );
};

export default EditAttributePage;
