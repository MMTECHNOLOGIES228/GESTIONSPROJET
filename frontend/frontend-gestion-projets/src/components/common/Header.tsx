import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
    const { user } = useAuth();

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
                                {user?.role?.toLowerCase().replace('_', ' ')}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;