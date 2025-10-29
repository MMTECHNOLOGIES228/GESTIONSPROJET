import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { projectService } from '../../services/project.service';
import { Project } from '../../types/project.types';

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // Cette fonction sera implémentée dans project.service.ts
      const response = await projectService.getProjects();
      setProjects(response.data || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des projets');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
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
              <p className="text-gray-600 mt-2">Gérez tous vos projets en un seul endroit</p>
            </div>
            <Link
              to="/projects/create"
              className="btn-primary"
            >
              + Nouveau Projet
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet</h3>
            <p className="text-gray-600 mb-4">Commencez par créer votre premier projet</p>
            <Link to="/projects/create" className="btn-primary">
              Créer un Projet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'active' ? 'Actif' : 
                       project.status === 'completed' ? 'Terminé' : 'En attente'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || 'Aucune description'}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {project.startDate 
                        ? new Date(project.startDate).toLocaleDateString()
                        : 'Non définie'
                      }
                    </span>
                    <span>{project.tasksCount || 0} tâches</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                    >
                      Voir détails →
                    </Link>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        ⋮
                      </button>
                    </div>
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