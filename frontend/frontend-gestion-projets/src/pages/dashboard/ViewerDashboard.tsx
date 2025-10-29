// pages/dashboard/ViewerDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const ViewerDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Observateur</h1>
        <p className="text-gray-600 mt-2">Accès en lecture seule aux projets et activités</p>
      </div>

      {/* Information sur le rôle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-blue-800">Rôle Observateur</h3>
            <p className="text-blue-700 text-sm mt-1">
              Vous avez un accès en lecture seule. Pour modifier des éléments, contactez un administrateur.
            </p>
          </div>
        </div>
      </div>

      {/* Widgets de consultation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projets</h3>
          <p className="text-gray-600 text-sm mb-4">
            Consultez tous les projets de l'organisation
          </p>
          <Link 
            to="/projects" 
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Voir les projets →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tâches</h3>
          <p className="text-gray-600 text-sm mb-4">
            Visualisez l'avancement des tâches
          </p>
          <Link 
            to="/tasks" 
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Voir les tâches →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipe</h3>
          <p className="text-gray-600 text-sm mb-4">
            Découvrez les membres de l'organisation
          </p>
          <Link 
            to="/team" 
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Voir l'équipe →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;