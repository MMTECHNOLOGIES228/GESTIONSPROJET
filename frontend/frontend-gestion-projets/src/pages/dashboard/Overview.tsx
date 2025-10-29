
import React from 'react';

const Overview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Projets Actifs</h3>
        <p className="text-3xl font-bold text-primary-600">0</p>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tâches en Cours</h3>
        <p className="text-3xl font-bold text-blue-600">0</p>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Membres</h3>
        <p className="text-3xl font-bold text-green-600">0</p>
      </div>
    </div>
  );
};

export default Overview; // ← AJOUTER CETTE LIGNE