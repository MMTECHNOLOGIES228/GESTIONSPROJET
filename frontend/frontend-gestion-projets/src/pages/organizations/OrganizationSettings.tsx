// pages/organizations/OrganizationSettings.tsx
import React, { useState, useEffect } from 'react';
import { organizationService } from '../../services/organization.service';

const OrganizationSettings: React.FC = () => {
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    settings: {
      theme: 'light',
      language: 'fr'
    }
  });

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const response = await organizationService.getOrganizations();
      const orgs = response.data || [];
      const currentOrg = orgs[0]; // Première organisation
      
      // if (currentOrg) {
      //   setOrganization(currentOrg);
      //   setFormData({
      //     name: currentOrg.name || '',
      //     description: currentOrg.description || '',
      //     settings: currentOrg.settings || {
      //       theme: 'light',
      //       language: 'fr'
      //     }
      //   });
      // }
    } catch (error) {
      console.error('Error loading organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await organizationService.updateOrganization(organization.id, formData);
      // Afficher un message de succès
      alert('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error('Error updating organization:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres de l'organisation</h1>
        <p className="text-gray-600 mt-2">Configurer votre organisation</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom de l'organisation */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'organisation *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nom de votre organisation"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Décrivez votre organisation..."
            />
          </div>

          {/* Paramètres d'apparence */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Apparence</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thème */}
              <div>
                <label htmlFor="settings.theme" className="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select
                  id="settings.theme"
                  name="settings.theme"
                  value={formData.settings.theme}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>

              {/* Langue */}
              <div>
                <label htmlFor="settings.language" className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select
                  id="settings.language"
                  name="settings.language"
                  value={formData.settings.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>

      {/* Section Danger */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-red-600">Zone de danger</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Supprimer l'organisation</h3>
              <p className="text-sm text-gray-500 mt-1">
                Une fois supprimée, l'organisation et toutes ses données seront définitivement effacées.
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Supprimer l'organisation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;