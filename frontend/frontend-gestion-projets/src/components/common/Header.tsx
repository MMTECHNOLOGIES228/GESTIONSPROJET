import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
    const { user } = useAuth();

    // Fonction pour formater le rôle
    const formatRole = (role: any): string => {
        if (!role) return 'Utilisateur';
        
        // Si c'est déjà une string, la formater
        if (typeof role === 'string') {
            return role.toLowerCase().replace('_', ' ');
        }
        
        // Si c'est un objet, essayer d'extraire le nom du rôle
        if (typeof role === 'object' && role.role_name) {
            return role.role_name.toLowerCase().replace('_', ' ');
        }
        
        return 'Utilisateur';
    };

    // Fonction pour obtenir les initiales
    const getInitials = (prenom?: string, nom?: string): string => {
        if (!prenom && !nom) return 'U';
        return `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tableau de Bord
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.prenom} {user?.nom}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                                {formatRole(user?.role)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                                {getInitials(user?.prenom, user?.nom)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;