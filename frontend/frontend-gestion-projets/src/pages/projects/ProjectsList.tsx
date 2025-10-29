import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { projectService } from '../../services/project.service';
import { Project } from '../../types/project.types';
import { usePermissions } from '../../hooks/usePermissions';

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { 
    canCreateProject, 
    canEditProject, 
    canDeleteProject,
    canManageProjectMembers,
    isSuperAdmin,
    isOrganizationOwner,
    isOrganizationAdmin
  } = usePermissions();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des projets');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projectName}" ?`)) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      // Recharger la liste des projets
      await loadProjects();
    } catch (err: any) {
      setError('Erreur lors de la suppression du projet');
      console.error('Error deleting project:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planning': { label: 'En planification', class: 'bg-blue-100 text-blue-800' },
      'active': { label: 'Actif', class: 'bg-green-100 text-green-800' },
      'on_hold': { label: 'En pause', class: 'bg-yellow-100 text-yellow-800' },
      'completed': { label: 'Terminé', class: 'bg-gray-100 text-gray-800' },
      'archived': { label: 'Archivé', class: 'bg-purple-100 text-purple-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': { label: 'Basse', class: 'bg-gray-100 text-gray-800' },
      'medium': { label: 'Moyenne', class: 'bg-blue-100 text-blue-800' },
      'high': { label: 'Haute', class: 'bg-orange-100 text-orange-800' },
      'urgent': { label: 'Urgente', class: 'bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || 
                   { label: priority, class: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
              <p className="text-gray-600 mt-2">
                {projects.length} projet{projects.length !== 1 ? 's' : ''} trouvé{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Bouton Nouveau Projet - conditionné par la permission */}
            {canCreateProject && (
              <Link
                to="/projects/create"
                className="btn-primary"
              >
                + Nouveau Projet
              </Link>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet</h3>
            <p className="text-gray-600 mb-4">
              {canCreateProject 
                ? "Commencez par créer votre premier projet" 
                : "Aucun projet n'a été créé pour le moment"
              }
            </p>
            {canCreateProject && (
              <Link to="/projects/create" className="btn-primary">
                Créer un Projet
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  {/* En-tête avec titre et statut */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
                      {project.name}
                    </h3>
                    {getStatusBadge(project.status || 'planning')}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || 'Aucune description'}
                  </p>
                  
                  {/* Métadonnées */}
                  <div className="space-y-2 mb-4">
                    {/* {project.priority && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Priorité:</span>
                        {getPriorityBadge(project.priority)}
                      </div>
                    )} */}
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        Début: {project.startDate 
                          ? new Date(project.startDate).toLocaleDateString()
                          : 'Non définie'
                        }
                      </span>
                      {project.endDate && (
                        <span>
                          Fin: {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    {project.budget && (
                      <div className="text-sm text-gray-500">
                        Budget: {project.budget.toLocaleString()} €
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                    >
                      Voir détails →
                    </Link>
                    
                    {/* Menu d'actions conditionnel */}
                    {(canEditProject || canDeleteProject || canManageProjectMembers) && (
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {/* Menu déroulant */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            {canEditProject && (
                              <Link
                                to={`/projects/${project.id}/edit`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Modifier le projet
                              </Link>
                            )}
                            
                            {canManageProjectMembers && (
                              <Link
                                to={`/projects/${project.id}/members`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Gérer les membres
                              </Link>
                            )}
                            
                            {canDeleteProject && (
                              <button
                                onClick={() => handleDeleteProject(project.id, project.name)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                              >
                                Supprimer le projet
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectsList;