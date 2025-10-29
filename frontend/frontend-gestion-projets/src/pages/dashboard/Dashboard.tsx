import React from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de Bord
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenue dans votre espace de gestion de projets
              </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Projets Actifs</h3>
                <p className="text-3xl font-bold text-primary-600">12</p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tâches en Cours</h3>
                <p className="text-3xl font-bold text-blue-600">24</p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Membres</h3>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progression</h3>
                <p className="text-3xl font-bold text-orange-600">75%</p>
              </div>
            </div>

            {/* Contenu supplémentaire */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Projets Récents
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600">Aucun projet pour le moment.</p>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tâches à Venir
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600">Aucune tâche à venir.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;