export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ApiErrorHandler {
  static handle(error: any): ApiError {
    // Erreur réseau
    if (!error.response) {
      return {
        message: 'Erreur de connexion. Vérifiez votre connexion internet.',
        code: 'NETWORK_ERROR'
      };
    }

    const { status, data } = error.response;

    // Erreurs HTTP spécifiques
    switch (status) {
      case 400:
        return {
          message: data?.message || 'Requête invalide',
          status,
          details: data
        };
      
      case 401:
        return {
          message: 'Session expirée. Veuillez vous reconnecter.',
          status,
          code: 'UNAUTHORIZED'
        };
      
      case 403:
        return {
          message: 'Accès refusé. Permissions insuffisantes.',
          status,
          code: 'FORBIDDEN'
        };
      
      case 404:
        return {
          message: 'Ressource non trouvée',
          status,
          code: 'NOT_FOUND'
        };
      
      case 409:
        return {
          message: data?.message || 'Conflit de données',
          status,
          code: 'CONFLICT'
        };
      
      case 422:
        return {
          message: 'Données invalides',
          status,
          details: data?.errors || data
        };
      
      case 500:
        return {
          message: 'Erreur interne du serveur',
          status,
          code: 'INTERNAL_ERROR'
        };
      
      default:
        return {
          message: data?.message || 'Une erreur est survenue',
          status,
          details: data
        };
    }
  }

  static getErrorMessage(error: any): string {
    return this.handle(error).message;
  }
}