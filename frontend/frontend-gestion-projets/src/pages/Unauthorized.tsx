// pages/Unauthorized.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/common/Layout';

const Unauthorized: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Récupérer la route demandée depuis l'état de navigation
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    // Messages différents selon le type d'erreur
    const getErrorMessage = () => {
        const state = location.state as any;

        if (state?.missingPermissions) {
            return `Permissions manquantes : ${state.missingPermissions.join(', ')}`;
        }

        if (state?.requiredRole) {
            return `Rôle requis : ${state.requiredRole}`;
        }

        return "Vous n'avez pas les autorisations nécessaires pour accéder à cette page.";
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        {/* Icône */}
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
                            <svg
                                className="h-12 w-12 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>

                        {/* Titre et message */}
                        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Accès non autorisé
                        </h1>

                        <p className="mt-4 text-lg text-gray-600">
                            {getErrorMessage()}
                        </p>

                        {/* Informations utilisateur */}
                        {user && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    Connecté en tant que :{' '}
                                    <span className="font-semibold">
                                        {user.prenom} {user.nom}
                                    </span>
                                    {' '}({user.role?.role_name})
                                </p>
                                {user.permissions && (
                                    <p className="text-xs text-blue-600 mt-1">
                                        Permissions : {user.permissions.length} permission(s)
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 space-y-4">
                            {/* Retour à la page précédente ou dashboard */}
                            <Link
                                to={from}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                {from === '/dashboard' ? 'Retour au tableau de bord' : 'Retour à la page précédente'}
                            </Link>

                            {/* Contact administrateur */}
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Si vous pensez que c'est une erreur,{' '}
                                    <a
                                        href="mailto:admin@votre-entreprise.com?subject=Problème d'accès"
                                        className="font-medium text-primary-600 hover:text-primary-500"
                                    >
                                        contactez votre administrateur
                                    </a>
                                </p>
                            </div>

                            {/* Déconnexion (optionnel) */}
                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={logout}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Se déconnecter et se reconnecter avec un autre compte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Unauthorized;