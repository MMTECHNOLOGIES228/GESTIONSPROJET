// import React from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

// components/common/Layout.tsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { usePermissions } from '../../hooks/usePermissions';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isSuperAdmin, isOrganizationOwner, isOrganizationAdmin } = usePermissions();

  const getRoleBadge = () => {
    if (isSuperAdmin) return { label: 'Super Admin', color: 'bg-purple-100 text-purple-800' };
    if (isOrganizationOwner) return { label: 'Propriétaire', color: 'bg-blue-100 text-blue-800' };
    if (isOrganizationAdmin) return { label: 'Administrateur', color: 'bg-green-100 text-green-800' };
    return { label: user?.role?.role_name || 'Utilisateur', color: 'bg-gray-100 text-gray-800' };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec badge de rôle */}
        <Header />
        
        {/* Role indicator in mobile view */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Connecté en tant que :</span>
            <span className={`px-2 py-1 text-xs rounded-full ${roleBadge.color}`}>
              {roleBadge.label}
            </span>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;