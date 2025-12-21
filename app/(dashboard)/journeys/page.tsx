'use client';

import { useMemo } from 'react';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Route, TrendingDown, Users, Target, ArrowRight } from 'lucide-react';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';
import WebSocketStatus from '@/components/ui/WebSocketStatus';

interface NavigationPath {
    path: string;
    users: number;
    conversions: number;
    rate: number;
}

interface ConversionStep {
    step: string;
    users: number;
    dropoff: number;
}

interface SessionData {
    navigationPaths?: NavigationPath[];
    conversionFunnel?: ConversionStep[];
}

export default function UserJourneysPage() {
    const { data, connected, reconnecting } = useWebSocket<SessionData>('telemetry:sessions');

    const sessionData = data;

    // Calculate journey stats
    const journeyStats = useMemo(() => {
        if (!sessionData?.navigationPaths) return { totalPaths: 0, avgConversionRate: 0 };

        const paths = sessionData.navigationPaths;
        const totalPaths = paths.length;
        const avgRate = paths.length > 0
            ? paths.reduce((sum, p) => sum + p.rate, 0) / paths.length
            : 0;

        return {
            totalPaths,
            avgConversionRate: Math.round(avgRate)
        };
    }, [sessionData]);

    // Funnel stats
    const funnelStats = useMemo(() => {
        if (!sessionData?.conversionFunnel || sessionData.conversionFunnel.length === 0) {
            return { totalDropoff: 0, criticalStep: 'N/A' };
        }

        const funnel = sessionData.conversionFunnel;
        const totalDropoff = funnel.reduce((sum, step) => sum + step.dropoff, 0);
        const maxDropoff = Math.max(...funnel.map(s => s.dropoff));
        const criticalStep = funnel.find(s => s.dropoff === maxDropoff);

        return {
            totalDropoff: Math.round(totalDropoff / funnel.length),
            criticalStep: criticalStep?.step || 'N/A'
        };
    }, [sessionData]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Route className="w-8 h-8 text-purple-600" />
                        Parcours Utilisateurs
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Analyse des chemins de navigation et de conversion
                    </p>
                </div>
                <WebSocketStatus connected={connected} reconnecting={reconnecting} />
            </div>

            {/* KPIs */}
            {!sessionData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <KPISkeleton key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Parcours Uniques"
                        value={journeyStats.totalPaths}
                        icon={Route}
                        color="purple"
                    />
                    <KPICard
                        title="Taux de Conversion Moyen"
                        value={`${journeyStats.avgConversionRate}%`}
                        icon={Target}
                        color="green"
                    />
                    <KPICard
                        title="Abandon Moyen"
                        value={`${funnelStats.totalDropoff}%`}
                        icon={TrendingDown}
                        color="red"
                    />
                    <KPICard
                        title="Étapes Actives"
                        value={sessionData.conversionFunnel?.length || 0}
                        icon={Users}
                        color="blue"
                    />
                </div>
            )}

            {/* Conversion Funnel */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Tunnel de Conversion
                </h3>
                {!sessionData ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="animate-pulse text-gray-400">Chargement...</div>
                    </div>
                ) : !sessionData.conversionFunnel || sessionData.conversionFunnel.length === 0 ? (
                    <div className="h-96 flex items-center justify-center text-gray-400">
                        Aucune donnée de conversion disponible
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={sessionData.conversionFunnel} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="step" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="users" fill="#10b981" name="Utilisateurs" />
                            <Bar dataKey="dropoff" fill="#ef4444" name="Abandon (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Top Navigation Paths */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <Route className="w-5 h-5 text-purple-600" />
                    Parcours les Plus Fréquents
                </h3>
                <div className="space-y-3">
                    {!sessionData ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))
                    ) : !sessionData.navigationPaths || sessionData.navigationPaths.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                            Aucun parcours enregistré pour le moment
                        </p>
                    ) : (
                        sessionData.navigationPaths.slice(0, 10).map((navPath, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate overflow-hidden">
                                                {navPath.path}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-blue-600" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {navPath.users} utilisateurs
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Target className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {navPath.conversions} conversions
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {navPath.rate}%
                                        </div>
                                        <div className="text-xs text-gray-500">taux</div>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-3 w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${navPath.rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Journey Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Critical Drop-off Point */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 min-w-0 overflow-hidden">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Point Critique d'Abandon
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                L'étape où les utilisateurs abandonnent le plus souvent leur parcours.
                            </p>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Étape Critique</div>
                                <div className="text-xl font-bold text-red-600">{funnelStats.criticalStep}</div>
                                <div className="text-xs text-gray-500 mt-1">Nécessite attention prioritaire</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Patterns */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 min-w-0 overflow-hidden">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Modèles de Réussite
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                Les parcours qui convertissent le mieux.
                            </p>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 min-w-0 overflow-hidden">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meilleur Parcours</div>
                                <div className="text-xl font-bold text-green-600">
                                    {sessionData?.navigationPaths?.[0]?.rate || 0}%
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate overflow-hidden">
                                    {sessionData?.navigationPaths?.[0]?.path || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Route className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            À Propos des Parcours Utilisateurs
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            Cette analyse vous aide à comprendre comment les visiteurs naviguent sur votre plateforme
                            et où ils rencontrent des obstacles. Utilisez ces insights pour optimiser l'expérience utilisateur.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                📊 Analyse comportementale
                            </span>
                            <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                🎯 Optimisation de conversion
                            </span>
                            <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                🔍 Identification des blocages
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner when no data */}
            {sessionData && (!sessionData.navigationPaths || sessionData.navigationPaths.length === 0) && (!sessionData.conversionFunnel || sessionData.conversionFunnel.length === 0) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Route className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Aucun parcours enregistré
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Les données de navigation et de conversion apparaîtront ici dès que
                                les utilisateurs commenceront à naviguer sur votre plateforme.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
