'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, MapPin, Clock, Activity } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import LocationMap from '@/components/LocationMap';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://discover-ht-production.up.railway.app';

interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    country: string;
    role: string;
    createdAt: string;
    lastLogin: string | null;
    lastLocation: { country: string; city: string } | null;
    stats: {
        totalSessions: number;
        totalPageviews: number;
        totalEvents: number;
    };
}

interface ActivityItem {
    type: 'event' | 'pageview';
    timestamp: string;
    [key: string]: any;
}

interface Interest {
    topEstablishments: Array<{ id: string; name: string; count: number }>;
    topSites: Array<{ id: string; name: string; count: number }>;
    topEvents: Array<{ id: string; name: string; count: number }>;
    preferredCategories: Array<{ category: string; count: number }>;
}

interface DeviceData {
    total: number;
    byDeviceType: Array<{ deviceType: string; count: number; percentage: number }>;
    byOS: Array<{ os: string; count: number; percentage: number }>;
    byBrowser: Array<{ browser: string; count: number; percentage: number }>;
}

interface LocationData {
    locations: Array<{
        type: 'gps' | 'ip';
        latitude?: number;
        longitude?: number;
        accuracy?: number;
        country?: string;
        city?: string;
        timestamp: string;
    }>;
    total: number;
    lastKnown: any;
}

export default function UserProfilePage() {
    const params = useParams();
    const { data: session } = useSession();
    const userId = params.userId as string;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [interests, setInterests] = useState<Interest | null>(null);
    const [devices, setDevices] = useState<DeviceData | null>(null);
    const [locations, setLocations] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId && session) {
            fetchUserData();
        }
    }, [userId, session]);

    const fetchUserData = async () => {
        try {
            const token = (session as any)?.accessToken;
            const headers = { Authorization: `Bearer ${token}` };

            const [profileRes, activityRes, interestsRes, devicesRes, locationsRes] = await Promise.all([
                axios.get(`${API_URL}/api/telemetry/user/${userId}/profile`, { headers }),
                axios.get(`${API_URL}/api/telemetry/user/${userId}/activity?limit=20`, { headers }),
                axios.get(`${API_URL}/api/telemetry/user/${userId}/interests`, { headers }),
                axios.get(`${API_URL}/api/telemetry/user/${userId}/devices`, { headers }),
                axios.get(`${API_URL}/api/telemetry/user/${userId}/locations?limit=50`, { headers })
            ]);

            setProfile(profileRes.data.data);
            setActivity(activityRes.data.data.timeline || []);
            setInterests(interestsRes.data.data);
            setDevices(devicesRes.data.data);
            setLocations(locationsRes.data.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-600">Utilisateur non trouvé</p>
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
                        Profil Utilisateur
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Analyse détaillée de l'activité
                    </p>
                </div>
            </div>

            {/* Section 1: General Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-100 dark:border-blue-900 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Informations Générales</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nom Complet</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile.fullName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dernier Login</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Statut</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {profile.role}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sessions</p>
                        <p className="text-2xl font-bold text-blue-600">{profile.stats.totalSessions}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pages Vues</p>
                        <p className="text-2xl font-bold text-green-600">{profile.stats.totalPageviews}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Événements</p>
                        <p className="text-2xl font-bold text-purple-600">{profile.stats.totalEvents}</p>
                    </div>
                </div>
            </div>

            {/* Section 2: Location */}
            {profile.lastLocation && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-green-100 dark:border-green-900 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-green-600 dark:bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dernière Localisation</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <MapPin className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {profile.lastLocation.city}, {profile.lastLocation.country}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Source: IP</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 3: Activity Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-purple-100 dark:border-purple-900 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-purple-600 dark:bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Timeline d&apos;Activité</h3>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activity.length > 0 ? (
                        activity.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <div className="flex-shrink-0">
                                    {item.type === 'event' ? (
                                        <Activity className="w-5 h-5 text-purple-600" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {item.type === 'event' ? item.eventType : item.path}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(item.timestamp).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">Aucune activité récente</p>
                    )}
                </div>
            </div>

            {/* Section 4: Tourist Interests */}
            {interests && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-yellow-100 dark:border-yellow-900 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Intérêts Touristiques</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Établissements Consultés</h4>
                            <div className="space-y-2">
                                {interests.topEstablishments.slice(0, 5).map((est, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{est.name}</span>
                                        <span className="text-sm font-bold text-yellow-600">{est.count} vues</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Catégories Préférées</h4>
                            <div className="space-y-2">
                                {interests.preferredCategories.slice(0, 5).map((cat, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.category}</span>
                                        <span className="text-sm font-bold text-yellow-600">{cat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 5: Devices */}
            {devices && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-red-100 dark:border-red-900 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-red-600 dark:bg-red-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appareils Utilisés</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Par Type</h4>
                            <div className="space-y-2">
                                {devices.byDeviceType.map((device, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{device.deviceType}</span>
                                        <span className="text-sm font-bold text-red-600">{device.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Par OS</h4>
                            <div className="space-y-2">
                                {devices.byOS.map((os, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{os.os}</span>
                                        <span className="text-sm font-bold text-red-600">{os.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Par Navigateur</h4>
                            <div className="space-y-2">
                                {devices.byBrowser.map((browser, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{browser.browser}</span>
                                        <span className="text-sm font-bold text-red-600">{browser.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section: Localisations */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localisations
                </h2>
                {locations && locations.total > 0 ? (
                    <div className="space-y-4">
                        {/* Statistiques */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded">
                                <div className="text-sm text-gray-600">Total</div>
                                <div className="text-2xl font-bold text-blue-600">{locations.total}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded">
                                <div className="text-sm text-gray-600">GPS</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {locations.locations.filter(l => l.type === 'gps').length}
                                </div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded">
                                <div className="text-sm text-gray-600">IP</div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {locations.locations.filter(l => l.type === 'ip').length}
                                </div>
                            </div>
                        </div>

                        {/* Carte interactive */}
                        <div className="mb-4">
                            <LocationMap locations={locations.locations} />
                        </div>

                        {/* Liste des localisations (en dessous de la carte) */}
                        <details className="mt-4">
                            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 mb-2">
                                Voir la liste détaillée ({locations.locations.length} positions)
                            </summary>
                            <div className="space-y-2 max-h-96 overflow-y-auto mt-2">
                                {locations.locations.slice(0, 20).map((location, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium">
                                                    {location.type === 'gps' ? '📍 GPS' : '🌐 IP'}
                                                    {location.city && location.country && (
                                                        <span className="ml-2 text-gray-600">
                                                            {location.city}, {location.country}
                                                        </span>
                                                    )}
                                                </div>
                                                {location.latitude && location.longitude && (
                                                    <div className="text-sm text-gray-500">
                                                        Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
                                                        {location.accuracy && (
                                                            <span className="ml-2">
                                                                (±{location.accuracy.toFixed(0)}m)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(location.timestamp).toLocaleString('fr-FR')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                ) : (
                    <p className="text-gray-500">Aucune localisation enregistrée</p>
                )}
            </div>
        </div>
    );
}
