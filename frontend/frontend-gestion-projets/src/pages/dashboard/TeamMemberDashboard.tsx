// pages/dashboard/TeamMemberDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

interface TeamMemberDashboardProps {
  isTeamLead?: boolean;
}

const TeamMemberDashboard: React.FC<TeamMemberDashboardProps> = ({ isTeamLead = false }) => {
  const { user } = usePermissions();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header personnalisé */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {isTeamLead 
            ? 'Responsable d\'équipe - Gérez vos tâches et votre équipe' 
            : 'Membre d\'équipe - Consultez vos tâches et projets'
          }
        </p>
      </div>

      {/* Widgets spécifiques au membre */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Mes tâches en cours */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mes tâches</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">5</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Tâches assignées à vous
          </p>
          <Link 
            to="/tasks?filter=assigned-to-me" 
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Voir mes tâches →
          </Link>
        </div>

        {/* Projets suivis */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mes projets</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">3</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Projets auxquels vous participez
          </p>
          <Link 
            to="/projects" 
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Voir les projets →
          </Link>
        </div>

        {/* Équipe (seulement pour Team Lead) */}
        {isTeamLead && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mon équipe</h3>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">8</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Membres de votre équipe
            </p>
            <Link 
              to="/team" 
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              Gérer l'équipe →
            </Link>
          </div>
        )}
      </div>

      {/* Contenu supplémentaire selon le rôle */}
      {isTeamLead && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions d'équipe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/tasks/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Nouvelle tâche</p>
                <p className="text-xs text-gray-500">Créer une tâche pour l'équipe</p>
              </div>
            </Link>

            <Link
              to="/team/reports"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Rapports d'équipe</p>
                <p className="text-xs text-gray-500">Analyser la performance</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberDashboard;