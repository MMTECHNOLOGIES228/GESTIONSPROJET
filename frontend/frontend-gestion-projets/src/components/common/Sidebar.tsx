import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', icon: '📊', label: 'Tableau de Bord' },
        { path: '/projects', icon: '📁', label: 'Projets' },
        { path: '/tasks', icon: '✅', label: 'Tâches' },
        { path: '/organizations', icon: '🏢', label: 'Organisations' },
        { path: '/users', icon: '👥', label: 'Utilisateurs' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Gestion Projets</h1>
                <p className="text-sm text-gray-600 mt-1">Bienvenue, {user?.prenom}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                    <span className="mr-3">🚪</span>
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;