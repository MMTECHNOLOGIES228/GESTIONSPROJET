// pages/dashboard/OrganizationOwnerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizationService } from '../../services/organization.service';
import { projectService } from '../../services/project.service';
import { usePermissions } from '../../hooks/usePermissions';

const OrganizationOwnerDashboard: React.FC = () => {
  const [organization, setOrganization] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const { isOrganizationOwner } = usePermissions();

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const loadOrganizationData = async () => {
    try {
      const [orgsResponse, projectsResponse, membersResponse] = await Promise.all([
        organizationService.getOrganizations(),
        projectService.getProjects(),
        organizationService.getOrganizationMembers('current') // À adapter selon votre API
      ]);

      const orgs = orgsResponse.data || [];
      const currentOrg = orgs[0]; // Première organisation pour l'exemple
      
      const projectsData = projectsResponse.data || [];
      const members = membersResponse.data || [];

      setOrganization(currentOrg);
      setProjects(projectsData.slice(0, 5));
      setStats({
        totalProjects: projectsData.length,
        activeProjects: projectsData.filter(p => p.status === 'active').length,
        totalMembers: members.length
      });
    } catch (error) {
      console.error('Error loading organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {organization?.name || 'Mon Organisation'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isOrganizationOwner ? 'Propriétaire' : 'Administrateur'} de l'organisation
        </p>
      </div>

      {/* Statistiques de l'organisation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projets totaux</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projets actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Membres</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalMembers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu spécifique au propriétaire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Projets récents */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Projets récents</h3>
              <Link to="/projects" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                Voir tout
              </Link>
            </div>
          </div>
          <div className="p-6">
            {/* Liste des projets similaires à ProjectsList */}
          </div>
        </div>

        {/* Gestion de l'organisation */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Gestion de l'organisation</h3>
          </div>
          <div className="p-6 space-y-4">
            <Link
              to="/organizations/settings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Paramètres de l'organisation</p>
                <p className="text-xs text-gray-500">Configurer votre organisation</p>
              </div>
            </Link>

            <Link
              to="/organizations/members"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Gérer les membres</p>
                <p className="text-xs text-gray-500">Inviter et gérer les membres</p>
              </div>
            </Link>

            {isOrganizationOwner && (
              <Link
                to="/organizations/billing"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Facturation</p>
                  <p className="text-xs text-gray-500">Gérer l'abonnement</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationOwnerDashboard;