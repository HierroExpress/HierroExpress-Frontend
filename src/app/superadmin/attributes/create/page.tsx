'use client'
import React from "react";

import RouteGuard from "@/helpers/routeGuard";
import AttributeCreate from "@/app/components/SuperAdminAttributes/attributeCreate";

const CreateAttributePage: React.FC = () => {
  return(
      <RouteGuard allowedRoles={['superadmin']}>
    <div>
      <AttributeCreate />
    </div>
      </RouteGuard>
  );
};

export default CreateAttributePage;