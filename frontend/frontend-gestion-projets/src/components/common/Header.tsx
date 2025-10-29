// components/common/Header.tsx
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const Header: React.FC = () => {
  const { user, isSuperAdmin, isOrganizationOwner, isOrganizationAdmin } = usePermissions();

  const getRoleDisplay = () => {
    if (isSuperAdmin) return 'Super Administrateur';
    if (isOrganizationOwner) return 'Propriétaire';
    if (isOrganizationAdmin) return 'Administrateur';
    return user?.role?.role_name || 'Utilisateur';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Tableau de Bord
          </h1>
          <div className="ml-4 hidden lg:block">
            <span className="text-sm text-gray-500">Connecté en tant que </span>
            <span className="text-sm font-medium text-primary-600">
              {getRoleDisplay()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications, profil, etc. */}
        </div>
      </div>
    </header>
  );
};

export default Header;