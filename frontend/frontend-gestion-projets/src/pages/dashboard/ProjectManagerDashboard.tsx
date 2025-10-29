// pages/dashboard/ProjectManagerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/project.service';
import { taskService } from '../../services/task.service';
import { Project } from '../../types/project.types';
import { Task } from '../../types/task.types';

const ProjectManagerDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        overdueTasks: 0,
        completedTasks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [projectsResponse, tasksResponse] = await Promise.all([
                projectService.getProjects(),
                taskService.getTasks()
            ]);

            const projectsData = projectsResponse.data || [];
            const tasksData = tasksResponse.data || [];

            const today = new Date();
            const overdueTasks = tasksData.filter(task =>
                task.dueDate && new Date(task.dueDate) < today && task.status !== 'done'
            );

            setProjects(projectsData.slice(0, 5));
            setTasks(tasksData.slice(0, 8));

            setStats({
                totalProjects: projectsData.length,
                activeProjects: projectsData.filter(p => p.status === 'active').length,
                completedProjects: projectsData.filter(p => p.status === 'completed').length,
                totalTasks: tasksData.length,
                overdueTasks: overdueTasks.length,
                completedTasks: tasksData.filter(t => t.status === 'done').length
            });
        } catch (error) {
            console.error('Error loading project manager dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { label: string; class: string } } = {
            'planning': { label: 'Planification', class: 'bg-blue-100 text-blue-800' },
            'active': { label: 'Actif', class: 'bg-green-100 text-green-800' },
            'on_hold': { label: 'En pause', class: 'bg-yellow-100 text-yellow-800' },
            'completed': { label: 'Terminé', class: 'bg-gray-100 text-gray-800' },
            'archived': { label: 'Archivé', class: 'bg-purple-100 text-purple-800' }
        };

        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const getTaskStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { label: string; class: string } } = {
            'todo': { label: 'À faire', class: 'bg-gray-100 text-gray-800' },
            'in_progress': { label: 'En cours', class: 'bg-blue-100 text-blue-800' },
            'review': { label: 'En revue', class: 'bg-yellow-100 text-yellow-800' },
            'done': { label: 'Terminé', class: 'bg-green-100 text-green-800' },
            'cancelled': { label: 'Annulé', class: 'bg-red-100 text-red-800' }
        };

        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityConfig: { [key: string]: { label: string; class: string } } = {
            'low': { label: 'Basse', class: 'bg-gray-100 text-gray-800' },
            'medium': { label: 'Moyenne', class: 'bg-blue-100 text-blue-800' },
            'high': { label: 'Haute', class: 'bg-orange-100 text-orange-800' },
            'urgent': { label: 'Urgente', class: 'bg-red-100 text-red-800' }
        };

        const config = priorityConfig[priority] || { label: priority, class: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const isTaskOverdue = (task: Task) => {
        if (!task.dueDate || task.status === 'done') return false;
        return new Date(task.dueDate) < new Date();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Gestionnaire</h1>
                <p className="text-gray-600 mt-2">Gérez vos projets et supervisez l'avancement des tâches</p>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Projets totaux */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Projets totaux</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalProjects}</p>
                        </div>
                    </div>
                </div>

                {/* Projets actifs */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Projets actifs</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
                        </div>
                    </div>
                </div>

                {/* Tâches en retard */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tâches en retard</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.overdueTasks}</p>
                        </div>
                    </div>
                </div>

                {/* Tâches terminées */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tâches terminées</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.completedTasks}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Projets récents */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Mes Projets</h3>
                            <div className="flex space-x-2">
                                <Link to="/projects" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                                    Voir tout
                                </Link>
                                <Link to="/projects/create" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                                    + Nouveau
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        {projects.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-3">📁</div>
                                <p className="text-gray-500 mb-4">Aucun projet pour le moment</p>
                                <Link to="/projects/create" className="btn-primary text-sm">
                                    Créer votre premier projet
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {projects.map(project => (
                                    <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {project.name}
                                                </h4>
                                                {getStatusBadge(project.status || 'planning')}
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">
                                                {project.description || 'Aucune description'}
                                            </p>
                                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                                <span>
                                                    Début: {project.startDate
                                                        ? new Date(project.startDate).toLocaleDateString()
                                                        : 'Non définie'
                                                    }
                                                </span>
                                                {/* {project.progress !== undefined && (
                                                    <span className="ml-4">
                                                        Progression: {project.progress}%
                                                    </span>
                                                )} */}
                                            </div>
                                        </div>
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="ml-4 text-primary-600 hover:text-primary-500"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tâches récentes */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Tâches Récentes</h3>
                            <div className="flex space-x-2">
                                <Link to="/tasks" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                                    Voir tout
                                </Link>
                                <Link to="/tasks/create" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                                    + Nouvelle
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        {tasks.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-3">✅</div>
                                <p className="text-gray-500 mb-4">Aucune tâche pour le moment</p>
                                <Link to="/tasks/create" className="btn-primary text-sm">
                                    Créer votre première tâche
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`p-3 border rounded-lg transition-colors ${isTaskOverdue(task)
                                                ? 'border-red-200 bg-red-50'
                                                : 'border-gray-200 hover:border-primary-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-900 flex-1 pr-2">
                                                {task.title}
                                            </h4>
                                            <div className="flex space-x-1">
                                                {task.priority && getPriorityBadge(task.priority)}
                                                {getTaskStatusBadge(task.status || 'todo')}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                            {task.description || 'Aucune description'}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>
                                                {task.project?.name || 'Sans projet'}
                                            </span>
                                            {task.dueDate && (
                                                <span className={isTaskOverdue(task) ? 'text-red-600 font-medium' : ''}>
                                                    Échéance: {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        {/* {task.assignee && (
                                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                                                    <span className="text-primary-600 text-xs font-medium">
                                                        {task.assignee.prenom?.[0]}{task.assignee.nom?.[0]}
                                                    </span>
                                                </div>
                                                Assigné à: {task.assignee.prenom} {task.assignee.nom}
                                            </div>
                                        )} */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions rapides et rapports */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Actions rapides */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                    <div className="space-y-3">
                        <Link
                            to="/projects/create"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Nouveau projet</p>
                                <p className="text-xs text-gray-500">Créer un nouveau projet</p>
                            </div>
                        </Link>

                        <Link
                            to="/tasks/create"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Nouvelle tâche</p>
                                <p className="text-xs text-gray-500">Créer une nouvelle tâche</p>
                            </div>
                        </Link>

                        <Link
                            to="/projects?filter=active"
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                        >
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Rapports</p>
                                <p className="text-xs text-gray-500">Voir les rapports d'avancement</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Progression globale */}
                <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression Globale</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Projets actifs</span>
                                <span>{stats.activeProjects} / {stats.totalProjects}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Tâches terminées</span>
                                <span>{stats.completedTasks} / {stats.totalTasks}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Tâches en retard</span>
                                <span className={stats.overdueTasks > 0 ? 'text-red-600 font-medium' : ''}>
                                    {stats.overdueTasks}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-600 h-2 rounded-full"
                                    style={{ width: `${stats.totalTasks > 0 ? (stats.overdueTasks / stats.totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Alertes importantes */}
                    {stats.overdueTasks > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-sm text-red-700">
                                    {stats.overdueTasks} tâche(s) en retard nécessite(nt) votre attention
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectManagerDashboard;