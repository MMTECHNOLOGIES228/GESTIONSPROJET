import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { LoginCredentials } from '../../types/auth.types';

const Login: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: '',
    password: '',
    authMethod: 'email'
  });
  
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Rediriger si déjà authentifié
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    
    setIsLoggingIn(false);
  };

  const fillDemoCredentials = (email: string) => {
    setFormData({
      identifier: email,
      password: 'password123',
      authMethod: 'email'
    });
    setShowDemoCredentials(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Gestion Projets
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Plateforme de gestion collaborative de projets
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900">Connexion</h3>
            <p className="text-slate-500 text-sm mt-1">Accédez à votre espace de travail</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-rose-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Auth Method */}
            <div>
              <label htmlFor="authMethod" className="block text-sm font-medium text-slate-700 mb-2">
                Méthode d'authentification
              </label>
              <select
                id="authMethod"
                name="authMethod"
                value={formData.authMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 transition-colors duration-200"
              >
                <option value="email">Email</option>
                <option value="phone">Téléphone</option>
              </select>
            </div>

            {/* Identifier */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 mb-2">
                {formData.authMethod === 'email' ? 'Adresse email' : 'Numéro de téléphone'}
              </label>
              <input
                id="identifier"
                name="identifier"
                type={formData.authMethod === 'email' ? 'email' : 'tel'}
                required
                value={formData.identifier}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900 transition-colors duration-200"
                placeholder={
                  formData.authMethod === 'email' 
                    ? 'votre@email.com' 
                    : '+33 1 23 45 67 89'
                }
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-slate-900 transition-colors duration-200"
                placeholder="Votre mot de passe"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:shadow-xl active:scale-95"
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Se connecter
                </div>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-3 pt-4 border-t border-slate-200">
            <a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200 font-medium">
              Mot de passe oublié ?
            </a>
            <div className="text-xs text-slate-500">
              © 2024 Gestion Projets. Tous droits réservés.
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="text-center space-y-3">
          <button
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="inline-flex items-center px-3 py-2 rounded-full bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors duration-200"
          >
            <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-amber-700">
              Identifiants de démonstration
            </span>
            <svg 
              className={`w-4 h-4 text-amber-600 ml-2 transition-transform duration-200 ${showDemoCredentials ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDemoCredentials && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-lg">
              <h4 className="text-sm font-semibold text-slate-900">Comptes de démonstration :</h4>
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                     onClick={() => fillDemoCredentials('superadmin@projectapp.com')}>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Super Admin</div>
                    <div className="text-xs text-slate-500">superadmin@projectapp.com</div>
                  </div>
                  <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                    Admin
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                     onClick={() => fillDemoCredentials('owner@company.com')}>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Propriétaire</div>
                    <div className="text-xs text-slate-500">owner@company.com</div>
                  </div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    Owner
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                     onClick={() => fillDemoCredentials('manager@company.com')}>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Manager Projet</div>
                    <div className="text-xs text-slate-500">manager@company.com</div>
                  </div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Manager
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                     onClick={() => fillDemoCredentials('member1@company.com')}>
                  <div>
                    <div className="text-sm font-medium text-slate-900">Membre Équipe</div>
                    <div className="text-xs text-slate-500">member1@company.com</div>
                  </div>
                  <div className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                    Member
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                Mot de passe pour tous les comptes : <strong>password123</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;