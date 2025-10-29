import { Request, Response, NextFunction } from 'express';
import { MemberService } from '../services/member.service';
import { AuthenticatedRequest } from './auth';


// Étendre l'objet Request pour inclure le contexte tenant
export interface TenantRequest extends AuthenticatedRequest {
    tenant?: {
        organization_id: string;
        user_id: string;
        user_role: string;
        permissions: string[];
        member?: any;
    };
}

/**
 * Middleware pour la gestion multi-tenant
 * Vérifie et valide l'accès à une organisation spécifique
 */
export const tenantMiddleware = (
    requiredPermissions: string[] = [],
    requiredRoles: string[] = []
) => {
    return async (req: TenantRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Vérifier que l'utilisateur est authentifié
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: "Utilisateur non authentifié"
                });
                return;
            }

            const memberService = new MemberService();

            // Extraire l'ID de l'organisation depuis différentes sources
            let organizationId: string | undefined;

            // Priorité 1 : Depuis les paramètres de chemin (ex: /organizations/:id/projects)
            if (req.params.organizationId) {
                organizationId = req.params.organizationId;
            }
            // Priorité 2 : Depuis le corps de la requête (pour les créations)
            else if (req.body.organization_id) {
                organizationId = req.body.organization_id;
            }
            // Priorité 3 : Depuis les paramètres de requête
            else if (req.query.organization_id) {
                organizationId = req.query.organization_id as string;
            }
            // Priorité 4 : Depuis le token JWT (si présent)
            //   else if (req.user.organization_id) {
            //     organizationId = req.user.organization_id;
            //   }

            // Vérifier que l'ID de l'organisation est fourni
            if (!organizationId) {
                res.status(400).json({
                    success: false,
                    message: "ID de l'organisation requis"
                });
                return;
            }

            // Vérifier que l'utilisateur est membre de cette organisation
            const memberResult = await memberService.getMemberByUser(organizationId, req.user.id);

            if (!memberResult.success || !memberResult.data) {
                res.status(403).json({
                    success: false,
                    message: "Accès refusé : vous n'êtes pas membre de cette organisation"
                });
                return;
            }

            const member = memberResult.data;

            // Vérifier les rôles requis si spécifiés
            if (requiredRoles.length > 0 && !requiredRoles.includes(member.role)) {
                res.status(403).json({
                    success: false,
                    message: `Accès refusé : rôle non autorisé. Rôles requis: ${requiredRoles.join(', ')}`
                });
                return;
            }

            // Vérifier les permissions requises si spécifiées
            if (requiredPermissions.length > 0) {
                const memberPermissions = Object.keys(member.permissions).filter(
                    key => (member.permissions as any)[key] === true
                );

                const hasRequiredPermissions = requiredPermissions.every(perm =>
                    memberPermissions.includes(perm)
                );

                if (!hasRequiredPermissions) {
                    res.status(403).json({
                        success: false,
                        message: `Accès refusé : permissions manquantes. Permissions requises: ${requiredPermissions.join(', ')}`
                    });
                    return;
                }
            }

            // Ajouter le contexte tenant à la requête
            req.tenant = {
                organization_id: organizationId,
                user_id: req.user.id,
                user_role: member.role,
                permissions: Object.keys(member.permissions).filter(
                    key => (member.permissions as any)[key] === true
                ),
                member: member
            };

            next();
        } catch (error) {
            console.error('Erreur dans le middleware tenant:', error);

            res.status(500).json({
                success: false,
                message: "Erreur interne du serveur lors de la validation tenant"
            });
        }
    };
};

/**
 * Middleware pour exiger un rôle spécifique dans l'organisation
 * À utiliser après le tenantMiddleware
 */
export const requireOrganizationRole = (allowedRoles: string[]) => {
    return (req: TenantRequest, res: Response, next: NextFunction): void => {
        try {
            if (!req.tenant) {
                res.status(401).json({
                    success: false,
                    message: "Contexte tenant non disponible"
                });
                return;
            }

            const userRole = req.tenant.user_role;

            if (!allowedRoles.includes(userRole)) {
                res.status(403).json({
                    success: false,
                    message: `Permissions insuffisantes. Rôles autorisés: ${allowedRoles.join(', ')}`
                });
                return;
            }

            next();
        } catch (error) {
            console.error('Erreur dans requireOrganizationRole:', error);
            res.status(500).json({
                success: false,
                message: "Erreur interne du serveur"
            });
        }
    };
};

/**
 * Middleware pour exiger une permission spécifique dans l'organisation
 * À utiliser après le tenantMiddleware
 */
export const requireOrganizationPermission = (requiredPermission: string) => {
    return async (req: TenantRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.tenant) {
                res.status(401).json({
                    success: false,
                    message: "Contexte tenant non disponible"
                });
                return;
            }

            const memberService = new MemberService();

            const hasPermission = await memberService.checkUserPermission(
                req.tenant.organization_id,
                req.tenant.user_id,
                requiredPermission
            );

            if (!hasPermission) {
                res.status(403).json({
                    success: false,
                    message: `Permission insuffisante. Permission requise: ${requiredPermission}`
                });
                return;
            }

            next();
        } catch (error) {
            console.error('Erreur dans requireOrganizationPermission:', error);
            res.status(500).json({
                success: false,
                message: "Erreur interne du serveur"
            });
        }
    };
};

/**
 * Middleware pour exiger le rôle propriétaire de l'organisation
 * À utiliser après le tenantMiddleware
 */
export const requireOrganizationOwner = (req: TenantRequest, res: Response, next: NextFunction): void => {
    try {
        if (!req.tenant) {
            res.status(401).json({
                success: false,
                message: "Contexte tenant non disponible"
            });
            return;
        }

        if (req.tenant.user_role !== 'owner') {
            res.status(403).json({
                success: false,
                message: "Seul le propriétaire de l'organisation peut effectuer cette action"
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Erreur dans requireOrganizationOwner:', error);
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

/**
 * Middleware pour valider l'appartenance d'un utilisateur cible
 * À utiliser après le tenantMiddleware
 */
export const validateTargetUserMembership = async (
    req: TenantRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.tenant) {
            res.status(401).json({
                success: false,
                message: "Contexte tenant non disponible"
            });
            return;
        }

        const targetUserId = req.params.userId || req.body.user_id;

        // Si pas d'utilisateur cible, on passe au middleware suivant
        if (!targetUserId) {
            next();
            return;
        }

        const memberService = new MemberService();

        // Vérifier que l'utilisateur cible est membre de la même organisation
        const targetMemberResult = await memberService.getMemberByUser(
            req.tenant.organization_id,
            targetUserId
        );

        if (!targetMemberResult.success) {
            res.status(404).json({
                success: false,
                message: "L'utilisateur cible n'est pas membre de cette organisation"
            });
            return;
        }

        // Ajouter les informations du membre cible au contexte tenant
        // req.tenant.target_member = targetMemberResult.data;

        next();
    } catch (error) {
        console.error('Erreur dans validateTargetUserMembership:', error);
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};