// pages/organizations/OrganizationBilling.tsx
import React, { useState, useEffect } from 'react';
import { organizationService } from '../../services/organization.service';

const OrganizationBilling: React.FC = () => {
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const loadOrganizationData = async () => {
    try {
      const response = await organizationService.getOrganizations();
      const orgs = response.data || [];
      setOrganization(orgs[0]);
      
      // Simuler des données de facturation
      setBillingHistory([
        { id: 1, date: '2024-01-01', amount: 29.99, status: 'paid', description: 'Abonnement Pro - Janvier 2024' },
        { id: 2, date: '2023-12-01', amount: 29.99, status: 'paid', description: 'Abonnement Pro - Décembre 2023' },
        { id: 3, date: '2023-11-01', amount: 29.99, status: 'paid', description: 'Abonnement Pro - Novembre 2023' },
      ]);
    } catch (error) {
      console.error('Error loading organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0€',
      description: 'Parfait pour les petites équipes',
      features: [
        'Jusqu\'à 5 membres',
        '3 projets actifs',
        'Stockage de base',
        'Support par email'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '29,99€',
      description: 'Idéal pour les équipes en croissance',
      features: [
        'Jusqu\'à 20 membres',
        'Projets illimités',
        'Stockage avancé',
        'Support prioritaire',
        'Analyses avancées'
      ]
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: '99,99€',
      description: 'Pour les grandes organisations',
      features: [
        'Membres illimités',
        'Projets illimités',
        'Stockage illimité',
        'Support 24/7',
        'SSO et sécurité avancée',
        'API personnalisée'
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Facturation</h1>
        <p className="text-gray-600 mt-2">Gérer l'abonnement</p>
      </div>

      {/* Plan actuel */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Votre plan actuel</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {plans.find(p => p.id === currentPlan)?.name}
              </h3>
              <p className="text-gray-600 mt-1">
                {plans.find(p => p.id === currentPlan)?.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {plans.find(p => p.id === currentPlan)?.price}
                <span className="text-sm font-normal text-gray-600">/mois</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Prochain paiement: 1 Février 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans disponibles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Changer de plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 ${
                plan.id === currentPlan
                  ? 'border-primary-500 ring-2 ring-primary-500'
                  : 'border-gray-200'
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                {plan.price}
                <span className="text-sm font-normal text-gray-600">/mois</span>
              </p>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  plan.id === currentPlan
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
                disabled={plan.id === currentPlan}
              >
                {plan.id === currentPlan ? 'Plan actuel' : 'Changer de plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Historique de facturation */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historique de facturation</h2>
        </div>
        <div className="p-6">
          {billingHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun historique de facturation</p>
          ) : (
            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{invoice.description}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(invoice.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{invoice.amount}€</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status === 'paid' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Informations de paiement */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Méthode de paiement</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Carte se terminant par 4242</p>
                <p className="text-sm text-gray-500">Expire le 12/2024</p>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationBilling;