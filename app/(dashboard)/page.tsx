'use client';

import { Activity, Clock, AlertTriangle, Users } from 'lucide-react';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';
import { useTelemetryOverview } from '@/lib/hooks/useTelemetryData';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const SEVERITY_COLORS = {
    critical: '#DC2626',
    error: '#F59E0B',
    warning: '#EAB308',
    info: '#3B82F6',
    debug: '#6B7280',
};

export default function OverviewPage() {
    const { data, loading, error } = useTelemetryOverview();

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
                <h3 className="text-red-900 font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-red-700">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Analytique</h1>
                <p className="text-gray-600">
                    Surveillance en temps réel du secteur touristique • Mise à jour : {data?.timestamp ? new Date(data.timestamp).toLocaleString('fr-FR') : '--'}
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading && !data ? (
                    <>
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                    </>
                ) : data ? (
                    <>
                        <KPICard
                            title="Événements Totaux"
                            value={data.events.total.toLocaleString('fr-FR')}
                            subtitle="Total des actions"
                            icon={Activity}
                            color="blue"
                        />
                        <KPICard
                            title="Temps Réponse Moyen"
                            value={`${Math.round(data.performance.averageResponseTime)}ms`}
                            subtitle="Global server response"
                            icon={Clock}
                            color="green"
                        />
                        <KPICard
                            title="Erreurs Actives"
                            value={data.errors.total}
                            subtitle="Non résolues"
                            icon={AlertTriangle}
                            color="red"
                        />
                        <KPICard
                            title="Sessions Totales"
                            value={data.sessions.totalSessions.toLocaleString('fr-FR')}
                            subtitle={`Moy durée: ${Math.round(data.sessions.averageDuration)}s`}
                            icon={Users}
                            color="purple"
                        />
                    </>
                ) : null}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Events by Type - Bar Chart */}
                <div className="bg-white rounded-xl border-2 border-blue-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Événements par Type</h3>
                    </div>

                    {loading && !data ? (
                        <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                    ) : data && data.events.byType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.events.byType}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="eventType" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p>Aucune donnée disponible pour la période</p>
                    </div>
          )}
                </div>

                {/* Errors by Severity - Donut Chart */}
                <div className="bg-white rounded-xl border-2 border-red-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Erreurs par Sévérité</h3>
                    </div>

                    {loading && !data ? (
                        <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                    ) : data && data.errors.bySeverity.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.errors.bySeverity}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="severity"
                            >
                                {data.errors.bySeverity.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || '#6B7280'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <p>Aucune erreur détectée</p>
                    </div>
          )}
                </div>
            </div>

            {/* Performance & Sessions Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Overview */}
                <div className="bg-white rounded-xl border-2 border-green-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Aperçu Performance</h3>
                    </div>

                    {loading && !data ? (
                        <div className="space-y-3">
                            <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                            <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                            <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                        </div>
                    ) : data ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Temps Réponse Moyen</span>
                                <span className="text-lg font-bold text-green-600">
                                    {Math.round(data.performance.averageResponseTime)}ms
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">TTFB Moyen</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {Math.round(data.performance.averageTTFB)}ms
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Temps Réponse Max</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {Math.round(data.performance.maxResponseTime)}ms
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">Temps Réponse Min</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {Math.round(data.performance.minResponseTime)}ms
                                </span>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Top Countries / Sessions */}
                <div className="bg-white rounded-xl border-2 border-purple-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Sessions par Pays</h3>
                    </div>

                    {loading && !data ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 animate-pulse rounded"></div>
                            ))}
                        </div>
                    ) : data && data.sessions.topCountries.length > 0 ? (
                    <div className="space-y-2">
                        {data.sessions.topCountries.slice(0, 10).map((country, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-purple-600 w-6">#{index + 1}</span>
                                    <span className="text-sm font-medium text-gray-900">{country.country || 'Inconnu'}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{country.count}</span>
                            </div>
                        ))}
                    </div>
                    ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400">
                        <p>Données géographiques en attente</p>
                    </div>
          )}
                </div>
            </div>
        </div>
    );
}
