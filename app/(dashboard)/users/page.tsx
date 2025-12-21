'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Search, Eye, Download, FileText } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { exportToCSV, exportToPDF } from '@/lib/utils/export';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://discover-ht-production.up.railway.app';

interface UserListItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UsersListPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [session]);

    const fetchUsers = async () => {
        try {
            const token = (session as any)?.accessToken;

            if (!token) {
                setError('Non authentifié - Veuillez vous connecter');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
                setFilteredUsers(response.data.data);
                setError(null);
            } else {
                setError('Format de réponse invalide');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.message || 'Erreur lors du chargement des utilisateurs';
            setError(errorMsg);
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = users.filter(user =>
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = users.filter(user =>
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const handleViewProfile = (userId: string) => {
        router.push(`/user/${userId}`);
    };

    const handleExport = async (format: 'csv' | 'pdf') => {
        try {
            const token = (session as any)?.accessToken;
            if (!token) {
                alert('Non authentifié');
                return;
            }

            // Fetch detailed user data
            const detailedUsers = await Promise.all(
                filteredUsers.map(async (user) => {
                    try {
                        const [profileRes, devicesRes, locationsRes] = await Promise.all([
                            axios.get(`${API_URL}/api/telemetry/user/${user.id}/profile`, { headers: { Authorization: `Bearer ${token}` } }),
                            axios.get(`${API_URL}/api/telemetry/user/${user.id}/devices`, { headers: { Authorization: `Bearer ${token}` } }),
                            axios.get(`${API_URL}/api/telemetry/user/${user.id}/locations?limit=1`, { headers: { Authorization: `Bearer ${token}` } })
                        ]);

                        const profile = profileRes.data.data;
                        const devices = devicesRes.data.data;
                        const locations = locationsRes.data.data;

                        return {
                            'Nom Complet': `${user.firstName} ${user.lastName}`,
                            'Email': user.email,
                            'Rôle': user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur',
                            'Date Inscription': new Date(user.createdAt).toLocaleDateString('fr-FR'),
                            'Dernière Connexion': profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString('fr-FR') : 'Jamais',
                            'Pays': profile.country || 'Non spécifié',
                            'Total Sessions': profile.stats?.totalSessions || 0,
                            'Total Pages Vues': profile.stats?.totalPageviews || 0,
                            'Total Événements': profile.stats?.totalEvents || 0,
                            'Appareils Utilisés': devices.total || 0,
                            'Dernière Localisation': locations.lastKnown
                                ? `${locations.lastKnown.city || 'Ville inconnue'}, ${locations.lastKnown.country || 'Pays inconnu'}`
                                : 'Non disponible'
                        };
                    } catch (error) {
                        console.error(`Error fetching data for user ${user.id}:`, error);
                        return {
                            'Nom Complet': `${user.firstName} ${user.lastName}`,
                            'Email': user.email,
                            'Rôle': user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur',
                            'Date Inscription': new Date(user.createdAt).toLocaleDateString('fr-FR'),
                            'Erreur': 'Données non disponibles'
                        };
                    }
                })
            );

            const filename = `utilisateurs_${new Date().toISOString().split('T')[0]}`;

            if (format === 'csv') {
                exportToCSV(detailedUsers, filename);
            } else {
                exportToPDF('Liste des Utilisateurs', detailedUsers, filename);
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Erreur lors de l\'export');
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-900 font-semibold mb-2">Erreur</h3>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="w-8 h-8 text-blue-600" />
                        Profils Utilisateurs
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Liste des utilisateurs avec accès aux analytics
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Exporter CSV
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Exporter PDF
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-100 dark:border-blue-900 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-100 dark:border-blue-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Rôle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Inscription
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewProfile(user.id)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Voir profil
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Utilisateurs</p>
                    <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Administrateurs</p>
                    <p className="text-3xl font-bold text-green-600">
                        {users.filter(u => u.role === 'ADMIN').length}
                    </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Utilisateurs</p>
                    <p className="text-3xl font-bold text-purple-600">
                        {users.filter(u => u.role === 'USER').length}
                    </p>
                </div>
            </div>
        </div>
    );
}
