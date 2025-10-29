import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { organizationService } from '../../services/organization.service';
import { Organization } from '../../types/organization.types';

const Organizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      // Cette fonction sera implémentée dans organization.service.ts
      const response = await organizationService.getOrganizations();
      setOrganizations(response.data || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des organisations');
      console.error('Error loading organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organisations</h1>
              <p className="text-gray-600 mt-2">Gérez vos organisations et leurs membres</p>
            </div>
            <Link
              to="/organizations/create"
              className="btn-primary"
            >
              + Nouvelle Organisation
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Organizations Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune organisation</h3>
            <p className="text-gray-600 mb-4">Créez votre première organisation pour commencer</p>
            <Link to="/organizations/create" className="btn-primary">
              Créer une Organisation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div key={org.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-primary-600 font-semibold text-lg">
                        {org.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-500">@{org.slug}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {org.description || 'Aucune description'}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{org.membersCount || 0} membres</span>
                    <span>{org.projectsCount || 0} projets</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/organizations/${org.id}`}
                      className="text-primary-600 hover:text-primary-500 font-medium text-sm"
                    >
                      Gérer →
                    </Link>
                    <div className="flex space-x-2">
                      <Link
                        to={`/organizations/${org.id}/settings`}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                      >
                        Paramètres
                      </Link>
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

export default Organizations;