// components/common/Layout.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { usePermissions } from '../../hooks/usePermissions';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isSuperAdmin, isOrganizationOwner, isOrganizationAdmin } = usePermissions();

  // Fonction pour générer les breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    const breadcrumbs = [];
    
    let currentPath = '';
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      
      // Noms personnalisés pour certaines routes
      let name = paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace(/-/g, ' ');
      
      // Personnaliser les noms des breadcrumbs
      switch (paths[i]) {
        case 'dashboard':
          name = 'Tableau de Bord';
          break;
        case 'projects':
          name = 'Projets';
          break;
        case 'create':
          name = 'Créer';
          break;
        case 'tasks':
          name = 'Tâches';
          break;
        case 'organizations':
          name = 'Organisation';
          break;
        case 'members':
          name = 'Membres';
          break;
        case 'settings':
          name = 'Paramètres';
          break;
        case 'billing':
          name = 'Facturation';
          break;
        case 'users':
          name = 'Utilisateurs';
          break;
        case 'roles':
          name = 'Rôles';
          break;
        default:
          break;
      }
      
      breadcrumbs.push({ name, path: currentPath });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const getRoleBadge = () => {
    if (isSuperAdmin) return { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 border border-purple-200' };
    if (isOrganizationOwner) return { label: 'Propriétaire', color: 'bg-blue-100 text-blue-800 border border-blue-200' };
    if (isOrganizationAdmin) return { label: 'Administrateur', color: 'bg-green-100 text-green-800 border border-green-200' };
    return { label: user?.role?.role_name || 'Utilisateur', color: 'bg-gray-100 text-gray-800 border border-gray-200' };
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
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${roleBadge.color}`}>
              {roleBadge.label}
            </span>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                {/* Lien vers le dashboard */}
                <li>
                  <Link 
                    to="/dashboard" 
                    className="hover:text-gray-700 transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                
                {/* Breadcrumbs dynamiques */}
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.path} className="flex items-center">
                    <svg 
                      className="flex-shrink-0 h-4 w-4 text-gray-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    
                    {index === breadcrumbs.length - 1 ? (
                      // Dernier élément (actuel) - pas de lien
                      <span className="ml-2 text-gray-700 font-medium capitalize">
                        {crumb.name}
                      </span>
                    ) : (
                      // Élément intermédiaire - avec lien
                      <Link 
                        to={crumb.path} 
                        className="ml-2 hover:text-gray-700 transition-colors duration-200 capitalize"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          
          {/* Contenu principal */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;