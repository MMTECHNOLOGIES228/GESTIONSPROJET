// pages/organizations/OrganizationMembers.tsx
import React, { useState, useEffect } from 'react';
import { organizationService } from '../../services/organization.service';

interface Member {
    id: string;
    user_id: string;
    role: string;
    user: {
        id: string;
        email: string;
        nom: string;
        prenom: string;
        profilePic?: string;
    };
    joined_at: string;
}

const OrganizationMembers: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
    const [inviteData, setInviteData] = useState({
        email: '',
        role: 'member' as 'owner' | 'admin' | 'member' | 'viewer'
    });
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const response = await organizationService.getOrganizationMembers('current');
            setMembers(response.data || []);
        } catch (error) {
            console.error('Error loading members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);

        try {
            await organizationService.inviteMember(inviteData.email, inviteData.role);
            setShowInviteModal(false);
            setInviteData({ email: '', role: 'member' });
            // Recharger la liste des membres
            loadMembers();
            alert('Invitation envoyée avec succès');
        } catch (error) {
            console.error('Error inviting member:', error);
            alert('Erreur lors de l\'envoi de l\'invitation');
        } finally {
            setInviting(false);
        }
    };

    const handleRoleChange = async (memberId: string, newRole: string) => {
        try {
            await organizationService.updateMemberRole(memberId, { role: newRole as any });
            // Mettre à jour localement
            setMembers(prev => prev.map(member =>
                member.id === memberId ? { ...member, role: newRole } : member
            ));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Erreur lors de la mise à jour du rôle');
        }
    };

    const openRemoveConfirmation = (memberId: string) => {
        setMemberToRemove(memberId);
        setShowRemoveModal(true);
    };

    const closeRemoveConfirmation = () => {
        setShowRemoveModal(false);
        setMemberToRemove(null);
    };

    const handleRemoveMember = async () => {
        if (!memberToRemove) return;

        try {
            await organizationService.removeMember(memberToRemove);
            setMembers(prev => prev.filter(member => member.id !== memberToRemove));
            closeRemoveConfirmation();
            alert('Membre retiré avec succès');
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Erreur lors du retrait du membre');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'owner': return 'bg-purple-100 text-purple-800';
            case 'admin': return 'bg-red-100 text-red-800';
            case 'member': return 'bg-blue-100 text-blue-800';
            case 'viewer': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getMemberToRemoveName = () => {
        const member = members.find(m => m.id === memberToRemove);
        return member ? `${member.user.prenom} ${member.user.nom}` : '';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gérer les membres</h1>
                <p className="text-gray-600 mt-2">Inviter et gérer les membres</p>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Membres de l'organisation ({members.length})
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Inviter un membre
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des membres */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    {members.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun membre</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Commencez par inviter des membres dans votre organisation.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                            {member.user.profilePic ? (
                                                <img
                                                    src={member.user.profilePic}
                                                    alt={`${member.user.prenom} ${member.user.nom}`}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600">
                                                    {member.user.prenom?.[0]}{member.user.nom?.[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Informations */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {member.user.prenom} {member.user.nom}
                                            </h4>
                                            <p className="text-sm text-gray-500">{member.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        {/* Rôle */}
                                        <select
                                            value={member.role}
                                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="viewer">Observateur</option>
                                            <option value="member">Membre</option>
                                            <option value="admin">Administrateur</option>
                                            <option value="owner">Propriétaire</option>
                                        </select>

                                        {/* Badge du rôle actuel */}
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                            {member.role}
                                        </span>

                                        {/* Bouton supprimer */}
                                        {member.role !== 'owner' && (
                                            <button
                                                onClick={() => openRemoveConfirmation(member.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Retirer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal d'invitation */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Inviter un membre</h3>

                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={inviteData.email}
                                        onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="email@exemple.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                        Rôle *
                                    </label>
                                    <select
                                        id="role"
                                        value={inviteData.role}
                                        onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value as any }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="viewer">Observateur</option>
                                        <option value="member">Membre</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inviting}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                                    >
                                        {inviting ? 'Envoi...' : 'Envoyer l\'invitation'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            {showRemoveModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 text-center mt-3">
                                Retirer le membre
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 text-center">
                                    Êtes-vous sûr de vouloir retirer <strong>{getMemberToRemoveName()}</strong> de l'organisation ?
                                </p>
                            </div>
                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    type="button"
                                    onClick={closeRemoveConfirmation}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemoveMember}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                >
                                    Retirer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationMembers;