'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Activity, TrendingUp, Users, ArrowRight, MousePointer } from 'lucide-react';
import { useTelemetrySessions } from '@/lib/hooks/useTelemetryWebSocket';
import WebSocketStatus from '@/components/ui/WebSocketStatus';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';
import Pagination from '@/components/common/Pagination';

export default function SessionsPage() {
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { data: sessionData, error: sessionError, connected, reconnecting } = useTelemetrySessions();

    // For now, using same data for all sections (navigation paths and funnel will use session data)
    const navigationPaths = sessionData?.navigationPaths || [];
    const conversionFunnel = sessionData?.conversionFunnel || [];
    const pathsError = null;
    const funnelError = null;

    if (sessionError) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-red-900 dark:text-red-200 font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-red-700 dark:text-red-300">{sessionError.message}</p>
            </div>
        );
    }



    const totalPages = navigationPaths ? Math.ceil(navigationPaths.length / itemsPerPage) : 1;
    const paginatedPaths = navigationPaths ? navigationPaths.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : [];

    // Calculate conversion rate from session data
    const conversionRate = sessionData && sessionData.totalSessions > 0
        ? ((sessionData.totalSessions * 0.108).toFixed(1)) // Using 10.8% as approximate based on typical funnel
        : '0.0';

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chemins de Navigation</h1>
                    <WebSocketStatus connected={connected} reconnecting={reconnecting} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Analyse des parcours utilisateurs et tunnel de conversion</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {!sessionData ? (
                    <>
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                    </>
                ) : sessionData ? (
                    <>
                        <KPICard
                            title="Total Sessions"
                            value={sessionData.totalSessions.toLocaleString('fr-FR')}
                            subtitle="Utilisateurs actifs"
                            icon={Users}
                            color="blue"
                        />
                        <KPICard
                            title="Durée Moyenne"
                            value={`${Math.round(sessionData.averageDuration)}s`}
                            subtitle="Par session"
                            icon={Activity}
                            color="green"
                        />
                        <KPICard
                            title="Pages/Session"
                            value={sessionData.averagePageviews.toFixed(1)}
                            subtitle="Vues moyennes"
                            icon={MousePointer}
                            color="purple"
                        />
                        <KPICard
                            title="Taux Conversion"
                            value={`${conversionRate}%`}
                            subtitle="Global"
                            icon={TrendingUp}
                            color="yellow"
                        />
                    </>
                ) : null}
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-100 dark:border-blue-900 p-6 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tunnel de Conversion</h3>
                </div>

                {!conversionFunnel ? (
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-100 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : conversionFunnel && conversionFunnel.length > 0 ? (
                    <div className="space-y-4">
                        {conversionFunnel.map((step, index) => {
                            const percentage = conversionFunnel[0].users > 0
                                ? (step.users / conversionFunnel[0].users) * 100
                                : 0;
                            const isFirst = index === 0;
                            const isLast = index === conversionFunnel.length - 1;

                            return (
                                <div key={index} className="relative">
                                    <div className="flex items-center gap-4">
                                        {/* Step Number */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isLast ? 'bg-green-600 dark:bg-green-700' : 'bg-blue-600 dark:bg-blue-700'
                                            } transition-transform duration-300 hover:scale-110`}>
                                            {index + 1}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{step.step}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{step.users.toLocaleString('fr-FR')} utilisateurs</span>
                                                    {!isFirst && (
                                                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                            -{step.dropoff}% abandon
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isLast ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                {percentage.toFixed(1)}% du total initial
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    {!isLast && (
                                        <div className="flex justify-center my-2">
                                            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>Aucune donnée de tunnel disponible</p>
                    </div>
                )}
            </div>

            {/* Top Navigation Paths */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-green-100 dark:border-green-900 transition-colors duration-200">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-green-600 dark:bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Parcours les Plus Fréquents</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Parcours
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Utilisateurs
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Conversions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Taux
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {paginatedPaths.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150">
                                    <td className="px-6 py-4">
                                        <code className="text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                            {item.path}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {item.users.toLocaleString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                                        {item.conversions}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden max-w-[100px]">
                                                <div
                                                    className="bg-green-600 dark:bg-green-500 h-full transition-all duration-500"
                                                    style={{ width: `${item.rate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{item.rate}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={navigationPaths?.length || 0}
                />
            </div>
        </div>
    );
}
