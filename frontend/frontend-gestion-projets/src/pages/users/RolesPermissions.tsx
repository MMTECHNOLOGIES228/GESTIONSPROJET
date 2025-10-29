// pages/users/RolesPermissions.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { roleService, Role, Permission } from '../../services/role.service';
import { usePermissions } from '../../hooks/usePermissions';

const RolesPermissions: React.FC = () => {
  const { isSuperAdmin } = usePermissions();
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  // Form states
  const [roleForm, setRoleForm] = useState({
    role_name: '',
    role_description: ''
  });
  const [permissionForm, setPermissionForm] = useState({
    perm_name: '',
    perm_description: ''
  });

  useEffect(() => {
    if (isSuperAdmin) {
      loadData();
    }
  }, [isSuperAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        roleService.getRolesWithPermissions(),
        roleService.getPermissions()
      ]);
      setRoles(rolesResponse.data || []);
      setPermissions(permissionsResponse.data || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading roles/permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await roleService.updateRole(editingRole.id, roleForm);
      } else {
        await roleService.createRole(roleForm);
      }
      setShowRoleModal(false);
      resetRoleForm();
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du rôle');
    }
  };

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await roleService.updatePermission(editingPermission.id, permissionForm);
      } else {
        await roleService.createPermission(permissionForm);
      }
      setShowPermissionModal(false);
      resetPermissionForm();
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la permission');
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      role_name: role.role_name,
      role_description: role.role_description
    });
    setShowRoleModal(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setPermissionForm({
      perm_name: permission.perm_name,
      perm_description: permission.perm_description
    });
    setShowPermissionModal(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${role.role_name}" ?`)) {
      return;
    }

    try {
      await roleService.deleteRole(role.id);
      await loadData();
    } catch (err: any) {
      setError('Erreur lors de la suppression du rôle');
    }
  };

  const handleDeletePermission = async (permission: Permission) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la permission "${permission.perm_name}" ?`)) {
      return;
    }

    try {
      await roleService.deletePermission(permission.id);
      await loadData();
    } catch (err: any) {
      setError('Erreur lors de la suppression de la permission');
    }
  };

  const handlePermissionToggle = async (role: Role, permission: Permission, hasPermission: boolean) => {
    try {
      if (hasPermission) {
        await roleService.removePermissionFromRole(role.id, permission.id);
      } else {
        await roleService.addPermissionToRole(role.id, permission.id);
      }
      await loadData();
    } catch (err: any) {
      setError('Erreur lors de la modification des permissions');
    }
  };

  const resetRoleForm = () => {
    setRoleForm({ role_name: '', role_description: '' });
    setEditingRole(null);
  };

  const resetPermissionForm = () => {
    setPermissionForm({ perm_name: '', perm_description: '' });
    setEditingPermission(null);
  };

  if (!isSuperAdmin) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">🚫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h3>
            <p className="text-gray-600">Vous devez être Super Admin pour accéder à cette page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rôles et Permissions</h1>
              <p className="text-gray-600 mt-2">Gérez les rôles et permissions du système</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rôles ({roles.length})
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Permissions ({permissions.length})
            </button>
          </nav>
        </div>

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Rôles</h2>
              <button
                onClick={() => {
                  resetRoleForm();
                  setShowRoleModal(true);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                + Nouveau Rôle
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{role.role_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{role.role_description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {role.permissions?.length || 0} permission(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedRole(role)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Gérer Permissions
                        </button>
                        <button
                          onClick={() => handleEditRole(role)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Permissions</h2>
              <button
                onClick={() => {
                  resetPermissionForm();
                  setShowPermissionModal(true);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                + Nouvelle Permission
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{permission.perm_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{permission.perm_description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditPermission(permission)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeletePermission(permission)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {editingRole ? 'Modifier le Rôle' : 'Nouveau Rôle'}
              </h3>
              <form onSubmit={handleCreateRole}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du rôle *
                    </label>
                    <input
                      type="text"
                      required
                      value={roleForm.role_name}
                      onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: Project Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      value={roleForm.role_description}
                      onChange={(e) => setRoleForm({ ...roleForm, role_description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Description du rôle..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoleModal(false);
                      resetRoleForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                  >
                    {editingRole ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Permission Modal */}
        {showPermissionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {editingPermission ? 'Modifier la Permission' : 'Nouvelle Permission'}
              </h3>
              <form onSubmit={handleCreatePermission}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la permission *
                    </label>
                    <input
                      type="text"
                      required
                      value={permissionForm.perm_name}
                      onChange={(e) => setPermissionForm({ ...permissionForm, perm_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: project.create"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      value={permissionForm.perm_description}
                      onChange={(e) => setPermissionForm({ ...permissionForm, perm_description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Description de la permission..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPermissionModal(false);
                      resetPermissionForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                  >
                    {editingPermission ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Role Permissions Modal */}
        {selectedRole && (
          <RolePermissionsModal
            role={selectedRole}
            permissions={permissions}
            onClose={() => setSelectedRole(null)}
            onPermissionToggle={handlePermissionToggle}
          />
        )}
      </div>
    </Layout>
  );
};

// Composant modal pour gérer les permissions d'un rôle
interface RolePermissionsModalProps {
  role: Role;
  permissions: Permission[];
  onClose: () => void;
  onPermissionToggle: (role: Role, permission: Permission, hasPermission: boolean) => void;
}

const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  role,
  permissions,
  onClose,
  onPermissionToggle
}) => {
  const hasPermission = (permissionId: string) => {
    return role.permissions?.some(p => p.id === permissionId) || false;
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const category = permission.perm_name.split(':')[0] || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            Permissions pour le rôle: {role.role_name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <div key={category}>
              <h4 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{permission.perm_name}</div>
                      <div className="text-sm text-gray-500">{permission.perm_description}</div>
                    </div>
                    <button
                      onClick={() => onPermissionToggle(role, permission, hasPermission(permission.id))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        hasPermission(permission.id) ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          hasPermission(permission.id) ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;