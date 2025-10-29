import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NotFound: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
          <p className="text-xl text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas.
          </p>
          <div className="space-y-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary inline-block"
              >
                Retour au Tableau de Bord
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn-primary inline-block"
              >
                Se Connecter
              </Link>
            )}
            <div>
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Retour à l'accueil ↩
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;