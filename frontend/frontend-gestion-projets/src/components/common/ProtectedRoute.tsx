// // Dans ProtectedRoute.tsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredPermissions?: string[];
//   requiredRole?: string;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
//   children, 
//   requiredPermissions = [], 
//   requiredRole 
// }) => {
//   const { user, isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();

//   if (isLoading) {
//     return <div>Chargement...</div>;
//   }

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Vérification du rôle requis
//   if (requiredRole && !hasRole(requiredRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Vérification des permissions requises
//   if (requiredPermissions.length > 0) {
//     const hasRequiredPermissions = requiredPermissions.every(permission => 
//       hasPermission(permission)
//     );

//     if (!hasRequiredPermissions) {
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

// components/common/ProtectedRoute.tsx (version améliorée)
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermissions?: string[];
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredPermissions = [],
    requiredRole
}) => {
    const { user, isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Vérification du rôle requis
    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <Navigate
                to="/unauthorized"
                state={{
                    from: location,
                    requiredRole,
                    missingPermissions: requiredPermissions
                }}
                replace
            />
        );
    }

    // Vérification des permissions requises
    if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every(permission =>
            hasPermission(permission)
        );

        if (!hasRequiredPermissions) {
            const missingPermissions = requiredPermissions.filter(
                permission => !hasPermission(permission)
            );

            return (
                <Navigate
                    to="/unauthorized"
                    state={{
                        from: location,
                        missingPermissions,
                        requiredRole
                    }}
                    replace
                />
            );
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;