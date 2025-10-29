import axios from 'axios';
import { apiEndpoints } from './apiEndpoints';

// Configuration de base pour tous les clients
const baseConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Client pour AUTH_SERVICE
export const authApiClient = axios.create({
  baseURL: apiEndpoints.AUTH_SERVICE,
  ...baseConfig,
});

// Client pour PROJECT_SERVICE
export const projectApiClient = axios.create({
  baseURL: apiEndpoints.PROJECT_SERVICE,
  ...baseConfig,
});

// Configuration des intercepteurs
const setupInterceptors = (client: any) => {
  // Intercepteur pour ajouter le token aux requêtes
  client.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur pour gérer les réponses et les erreurs
  client.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;

      // Gestion des erreurs 401 (Non autorisé)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            // Tentative de rafraîchissement du token
            const refreshResponse = await authApiClient.post('/auth/refresh-token', {
              refreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
            
            // Mise à jour des tokens
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // Retry de la requête originale avec le nouveau token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);
            
          } catch (refreshError) {
            // Si le refresh échoue, déconnecter l'utilisateur
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          // Pas de refresh token, déconnexion
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      // Gestion d'autres erreurs
      if (error.response?.status >= 500) {
        console.error('Erreur serveur:', error.response);
      }

      return Promise.reject(error);
    }
  );
};

// Appliquer les intercepteurs aux deux clients
setupInterceptors(authApiClient);
setupInterceptors(projectApiClient);

export { apiEndpoints };