'use client';

import { useSession } from 'next-auth/react';
import { Globe, MapPin, Smartphone, Monitor, Tablet } from 'lucide-react';
import { getGeoStats, getDeviceStats } from '@/lib/api/telemetry';
import { usePolling } from '@/lib/hooks/usePolling';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';
import WorldHeatmap from '@/components/charts/WorldHeatmap';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const DEVICE_COLORS = {
    mobile: '#3B82F6',
    tablet: '#10B981',
    desktop: '#8B5CF6',
    unknown: '#6B7280',
};

export default function AnalyticsGeoPage() {
    const { data: session } = useSession();

    const { data: geoData, loading: geoLoading, error: geoError } = usePolling(
        async () => {
            if (!session?.accessToken) throw new Error('No token');
            return getGeoStats(session.accessToken);
        },
        5000,
        !!session?.accessToken
    );

    const { data: deviceData, loading: deviceLoading, error: deviceError } = usePolling(
        async () => {
            if (!session?.accessToken) throw new Error('No token');
            return getDeviceStats(session.accessToken);
        },
        5000,
        !!session?.accessToken
    );

    if (geoError || deviceError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-900 font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-red-700">{geoError?.message || deviceError?.message}</p>
            </div>
        );
    }

    const loading = geoLoading || deviceLoading;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Géographiques & Appareils</h1>
                <p className="text-gray-600">Analyse de la distribution géographique et des appareils utilisés</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {loading && !geoData ? (
                    <>
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                    </>
                ) : geoData && deviceData ? (
                    <>
                        <KPICard
                            title="Total Sessions"
                            value={geoData.totalSessions.toLocaleString('fr-FR')}
                            subtitle="Toutes régions confondues"
                            icon={Globe}
                            color="blue"
                        />
                        <KPICard
                            title="Pays Couverts"
                            value={geoData.byCountry.length}
                            subtitle={`Top: ${geoData.byCountry[0]?.country || 'N/A'}`}
                            icon={MapPin}
                            color="green"
                        />
                        <KPICard
                            title="Villes Actives"
                            value={geoData.byCity.length}
                            subtitle="Localisations détectées"
                            icon={Smartphone}
                            color="purple"
                        />
                        <KPICard
                            title="Total Appareils"
                            value={deviceData.total.toLocaleString('fr-FR')}
                            subtitle="Sessions enregistrées"
                            icon={Monitor}
                            color="blue"
                        />
                    </>
                ) : null}
            </div>

            {/* World Heatmap */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-100 dark:border-blue-900 p-6 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Carte Mondiale des Sessions</h3>
                </div>

                {loading && !geoData ? (
                    <div className="h-96 bg-gray-100 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                ) : geoData ? (
                    <WorldHeatmap data={geoData.byCountry || []} />
                ) : (
                    <div className="h-96 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <p>Erreur de chargement</p>
                    </div>
                )}
            </div>

            {/* Device Stats - Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Devices by Type */}
                <div className="bg-white rounded-xl border-2 border-blue-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Par Type d&apos;Appareil</h3>
                    </div>

                    {loading && !deviceData ? (
                        <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                    ) : deviceData && deviceData.byDeviceType.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={deviceData.byDeviceType}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="deviceType"
                                    label={(entry) => `${entry.deviceType}: ${entry.percentage}%`}
                                >
                                    {deviceData.byDeviceType.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={DEVICE_COLORS[entry.deviceType.toLowerCase() as keyof typeof DEVICE_COLORS] || DEVICE_COLORS.unknown}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <p>Aucune donnée disponible</p>
                        </div>
                    )}
                </div>

                {/* OS Distribution */}
                <div className="bg-white rounded-xl border-2 border-green-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Par Système d&apos;Exploitation</h3>
                    </div>

                    {loading && !deviceData ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded"></div>
                            ))}
                        </div>
                    ) : deviceData && deviceData.byOS.length > 0 ? (
                        <div className="space-y-2">
                            {deviceData.byOS.map((os, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-900">{os.os}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-900">{os.count}</span>
                                        <span className="text-xs text-gray-600">({os.percentage}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-400">
                            <p>Aucune donnée disponible</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sessions by Country - Table */}
            <div className="bg-white rounded-xl border-2 border-blue-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Sessions par Pays</h3>
                </div>

                {loading && !geoData ? (
                    <div className="space-y-2">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : geoData && geoData.byCountry.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Pays</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Sessions</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Pourcentage</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Durée Moy.</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Pages Moy.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {geoData.byCountry.map((country, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900">{country.country}</td>
                                        <td className="py-3 px-4 text-gray-700">{country.sessions}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden max-w-[100px]">
                                                    <div
                                                        className="bg-blue-600 h-full"
                                                        style={{ width: `${country.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{country.percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{country.avgDuration}s</td>
                                        <td className="py-3 px-4 text-gray-700">{country.avgPageviews}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>Données géographiques en attente</p>
                    </div>
                )}
            </div>

            {/* Top Cities */}
            <div className="bg-white rounded-xl border-2 border-green-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Top 20 Villes</h3>
                </div>

                {loading && !geoData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : geoData && geoData.byCity.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {geoData.byCity.map((city, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {city.city}, {city.country}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{city.sessions}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>Aucune ville détectée</p>
                    </div>
                )}
            </div>
        </div>
    );
}
