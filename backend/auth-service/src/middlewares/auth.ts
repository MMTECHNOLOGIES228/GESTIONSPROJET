

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { privateKey } from '../auth/private_key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
}

export default (requiredPermissions: string[] = [], requiredRoles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        return res.status(401).json({
          success: false,
          message: "Jeton d'authentification manquant. Veuillez fournir un jeton valide."
        });
      }

      // Vérifier le format du header
      const parts = authorizationHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
          success: false,
          message: "Format d'autorisation invalide. Utilisez: Bearer <token>"
        });
      }

      const token = parts[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token manquant dans le header Authorization"
        });
      }

      // Vérifier le token
      const decodedToken = jwt.verify(token, privateKey) as any;

      const { utilisateurId, role, permissions } = decodedToken;

      if (!utilisateurId || !role || !permissions) {
        return res.status(403).json({
          success: false,
          message: "Token invalide: informations manquantes"
        });
      }

      req.user = {
        id: utilisateurId,
        role,
        permissions
      };

      // Vérifier les rôles requis
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé : rôle non autorisé."
        });
      }

      // Vérifier les permissions requises
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every(perm => 
          permissions.includes(perm)
        );
        if (!hasRequiredPermissions) {
          return res.status(403).json({
            success: false,
            message: "Accès refusé : permissions manquantes."
          });
        }
      }

      next();
    } catch (error: any) {
      console.error('Erreur vérification token:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token expiré"
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: "Token invalide"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur d'authentification"
      });
    }
  };
};