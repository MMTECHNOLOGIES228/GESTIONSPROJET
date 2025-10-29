// components/common/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const { 
    canCreateProject, 
    canReadProject, 
    canReadTask,
    canReadOrganization,
    canManageOrganizationMembers,
    isSuperAdmin,
    isOrganizationOwner,
    isOrganizationAdmin,
    isProjectManager,
    isTeamLead,
    isMember,
    isViewer
  } = usePermissions();

  const navigation = [
    {
      name: 'Tableau de Bord',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      show: true
    },
    {
      name: 'Projets',
      href: '/projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      show: canReadProject,
      subItems: [
        {
          name: 'Tous les projets',
          href: '/projects',
          show: canReadProject
        },
        {
          name: 'Nouveau projet',
          href: '/projects/create',
          show: canCreateProject
        },
        {
          name: 'Mes projets',
          href: '/projects?filter=my-projects',
          show: canReadProject
        },
        {
          name: 'Projets actifs',
          href: '/projects?filter=active',
          show: canReadProject
        },
        {
          name: 'Projets terminés',
          href: '/projects?filter=completed',
          show: canReadProject
        }
      ]
    },
    {
      name: 'Tâches',
      href: '/tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      show: canReadTask,
      subItems: [
        {
          name: 'Toutes les tâches',
          href: '/tasks',
          show: canReadTask
        },
        {
          name: 'Nouvelle tâche',
          href: '/tasks/create',
          show: canCreateProject
        },
        {
          name: 'Mes tâches',
          href: '/tasks?filter=assigned-to-me',
          show: canReadTask
        },
        {
          name: 'Tâches en retard',
          href: '/tasks?filter=overdue',
          show: canReadTask
        },
        {
          name: 'Tâches en cours',
          href: '/tasks?filter=in-progress',
          show: canReadTask
        },
        {
          name: 'Tâches terminées',
          href: '/tasks?filter=done',
          show: canReadTask
        }
      ]
    },
    {
      name: 'Organisation',
      href: '/organizations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      show: canReadOrganization || canManageOrganizationMembers || isOrganizationOwner || isOrganizationAdmin,
      subItems: [
        {
          name: 'Vue générale',
          href: '/organizations',
          show: canReadOrganization
        },
        {
          name: 'Membres',
          href: '/organizations/members',
          show: canManageOrganizationMembers
        },
        {
          name: 'Paramètres',
          href: '/organizations/settings',
          show: isOrganizationOwner || isOrganizationAdmin
        },
        {
          name: 'Facturation',
          href: '/organizations/billing',
          show: isOrganizationOwner
        },
        {
          name: 'Analytiques',
          href: '/organizations/analytics',
          show: isOrganizationOwner || isOrganizationAdmin
        }
      ]
    },
    {
      name: 'Utilisateurs',
      href: '/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      show: isSuperAdmin,
      subItems: [
        {
          name: 'Tous les utilisateurs',
          href: '/users',
          show: isSuperAdmin
        },
        {
          name: 'Nouvel utilisateur',
          href: '/users/create',
          show: isSuperAdmin
        },
        {
          name: 'Rôles et permissions',
          href: '/users/roles',
          show: isSuperAdmin
        },
        {
          name: 'Journal des activités',
          href: '/users/activity',
          show: isSuperAdmin
        }
      ]
    },
    {
      name: 'Rapports',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      show: isProjectManager || isOrganizationOwner || isOrganizationAdmin || isTeamLead,
      subItems: [
        {
          name: 'Rapports projets',
          href: '/reports/projects',
          show: isProjectManager || isOrganizationOwner || isOrganizationAdmin
        },
        {
          name: 'Rapports tâches',
          href: '/reports/tasks',
          show: isProjectManager || isTeamLead
        },
        {
          name: 'Rapports équipe',
          href: '/reports/team',
          show: isTeamLead || isProjectManager
        },
        {
          name: 'Rapports performance',
          href: '/reports/performance',
          show: isOrganizationOwner || isOrganizationAdmin
        },
        {
          name: 'Analytiques avancées',
          href: '/reports/analytics',
          show: isOrganizationOwner || isOrganizationAdmin
        }
      ]
    },
    {
      name: 'Calendrier',
      href: '/calendar',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      show: canReadProject || canReadTask,
      subItems: [
        {
          name: 'Vue mensuelle',
          href: '/calendar/month',
          show: canReadProject || canReadTask
        },
        {
          name: 'Vue hebdomadaire',
          href: '/calendar/week',
          show: canReadProject || canReadTask
        },
        {
          name: 'Vue quotidienne',
          href: '/calendar/day',
          show: canReadProject || canReadTask
        },
        {
          name: 'Mes échéances',
          href: '/calendar/my-deadlines',
          show: canReadTask
        }
      ]
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      show: true,
      subItems: [
        {
          name: 'Mon profil',
          href: '/profile',
          show: true
        },
        {
          name: 'Préférences',
          href: '/settings/preferences',
          show: true
        },
        {
          name: 'Sécurité',
          href: '/settings/security',
          show: true
        },
        {
          name: 'Notifications',
          href: '/settings/notifications',
          show: true
        },
        {
          name: 'Paramètres système',
          href: '/system/settings',
          show: isSuperAdmin
        },
        {
          name: 'API & Intégrations',
          href: '/settings/integrations',
          show: isSuperAdmin || isOrganizationOwner
        }
      ]
    }
  ];

  // Fonction améliorée pour détecter l'activation
  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href;
    }
    
    // Pour les routes avec sous-menus, on vérifie si le chemin commence par l'href
    if (href !== '/dashboard' && href !== '/') {
      return location.pathname.startsWith(href);
    }
    
    return location.pathname === href;
  };

  // Vérifier si un item parent est actif (pour l'expansion automatique)
  const isParentActive = (item: any) => {
    if (isActive(item.href)) return true;
    
    if (item.subItems) {
      return item.subItems.some((subItem: any) => isActive(subItem.href, true));
    }
    
    return false;
  };

  // Gérer l'expansion des items
  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  // Expansion automatique basée sur la route actuelle
  React.useEffect(() => {
    const activeItems: string[] = [];
    
    navigation.forEach(item => {
      if (isParentActive(item)) {
        activeItems.push(item.name);
      }
    });
    
    setExpandedItems(activeItems);
  }, [location.pathname]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Filtrer les éléments de navigation qui doivent être affichés
  const visibleNavigation = navigation.filter(item => item.show);

  return (
    <div className={`bg-white border-r border-red-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      {/* Logo et bouton de collapse */}
      <div className="flex items-center justify-between p-4 border-b border-red-200 flex-shrink-0 bg-gradient-to-r from-green-50 to-white">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="ml-2 text-lg font-bold text-green-800">GestionProjets</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-green-100 transition-colors"
          title={isCollapsed ? "Développer" : "Réduire"}
        >
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto bg-gradient-to-b from-white to-green-50">
        {visibleNavigation.map((item) => {
          const hasSubItems = item.subItems && item.subItems.filter(sub => sub.show).length > 0;
          const isItemActive = isParentActive(item);
          const isExpanded = expandedItems.includes(item.name) || isItemActive;
          const visibleSubItems = item.subItems?.filter(sub => sub.show) || [];
          
          return (
            <div key={item.name}>
              {hasSubItems && visibleSubItems.length > 0 ? (
                <div className="mb-2">
                  {/* Item principal avec sous-menus */}
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isItemActive
                        ? 'bg-green-100 text-green-800 border border-green-300 shadow-sm'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 transition-colors ${
                      isItemActive ? 'text-green-600' : 'text-green-500'
                    }`}>
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.name}</span>
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          } ${isItemActive ? 'text-green-500' : 'text-green-400'}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Sous-menus */}
                  {!isCollapsed && isExpanded && (
                    <div className="mt-1 ml-4 space-y-1">
                      {visibleSubItems.map((subItem) => {
                        const isSubItemActive = isActive(subItem.href, true);
                        
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isSubItemActive
                                ? 'bg-green-200 text-green-900 font-medium border-l-2 border-green-500 shadow-sm'
                                : 'text-gray-600 hover:bg-green-100 hover:text-green-800 hover:border-l-2 hover:border-green-300'
                            }`}
                          >
                            <div className={`w-1 h-1 rounded-full mr-3 ${
                              isSubItemActive ? 'bg-green-500' : 'bg-green-300'
                            }`}></div>
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Item simple sans sous-menus
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href, true)
                      ? 'bg-green-100 text-green-800 border border-green-300 shadow-sm'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                  }`}
                >
                  <div className={`flex-shrink-0 transition-colors ${
                    isActive(item.href, true) ? 'text-green-600' : 'text-green-500'
                  }`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Section utilisateur et déconnexion */}
      <div className="p-4 border-t border-red-200 flex-shrink-0 space-y-3 bg-gradient-to-t from-white to-green-50">
        {/* Informations utilisateur */}
        {!isCollapsed && user && (
          <div className="flex items-center space-x-3 p-3 bg-green-100 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow">
              <span className="text-xs font-semibold text-white">
                {user.prenom?.[0]}{user.nom?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-900 truncate">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-green-700 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Indicateur de rôle */}
        {!isCollapsed && (
          <div className="bg-green-100 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-900">Votre rôle</p>
                <p className="text-xs text-green-700">
                  {isSuperAdmin && 'Super Admin'}
                  {isOrganizationOwner && 'Propriétaire'}
                  {isOrganizationAdmin && 'Administrateur'}
                  {isProjectManager && 'Gestionnaire'}
                  {isTeamLead && 'Responsable équipe'}
                  {isMember && 'Membre'}
                  {isViewer && 'Observateur'}
                </p>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full font-medium ${
                isSuperAdmin ? 'bg-red-200 text-red-800 border border-red-300' :
                isOrganizationOwner ? 'bg-green-200 text-green-800 border border-green-300' :
                isOrganizationAdmin ? 'bg-green-300 text-green-900 border border-green-400' :
                isProjectManager ? 'bg-yellow-200 text-yellow-800 border border-yellow-300' :
                isTeamLead ? 'bg-blue-200 text-blue-800 border border-blue-300' :
                'bg-gray-200 text-gray-800 border border-gray-300'
              }`}>
                {isSuperAdmin && 'Admin'}
                {isOrganizationOwner && 'Owner'}
                {isOrganizationAdmin && 'Admin'}
                {isProjectManager && 'Manager'}
                {isTeamLead && 'Lead'}
                {isMember && 'Member'}
                {isViewer && 'Viewer'}
              </div>
            </div>
          </div>
        )}

        {/* Bouton de déconnexion */}
        <button
          onClick={confirmLogout}
          className={`w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
            isCollapsed 
              ? 'text-red-700 border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-400' 
              : 'text-red-700 border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-400 hover:text-red-800'
          }`}
          title={isCollapsed ? "Déconnexion" : ""}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span className="ml-2 font-semibold">Déconnexion</span>}
        </button>
      </div>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 border border-red-200 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3 border border-red-200">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Déconnexion</h3>
                <p className="text-sm text-red-600">Êtes-vous sûr de vouloir vous déconnecter ?</p>
              </div>
            </div>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;