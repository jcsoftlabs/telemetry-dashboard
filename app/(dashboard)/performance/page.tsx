'use client';

import { useSession } from 'next-auth/react';
import { Zap, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useTelemetryOverview } from '@/lib/hooks/useTelemetryWebSocket';
import WebSocketStatus from '@/components/ui/WebSocketStatus';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';

export default function PerformancePage() {
    const { data: session } = useSession();
    const { data: overviewData, error, connected, reconnecting } = useTelemetryOverview();
    const data = overviewData?.performance;

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-900 font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-red-700">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">Performances API</h1>
                    <WebSocketStatus connected={connected} reconnecting={reconnecting} />
                </div>
                <p className="text-gray-600">Monitoring des temps de réponse et Core Web Vitals</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {!data ? (
                    <>
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                    </>
                ) : data ? (
                    <>
                        <KPICard
                            title="TTFB Moyen"
                            value={`${Math.round(data.averageTTFB)}ms`}
                            subtitle="Time To First Byte"
                            icon={Zap}
                            color="blue"
                        />
                        <KPICard
                            title="Temps Réponse Moy."
                            value={`${Math.round(data.averageResponseTime)}ms`}
                            subtitle="Global server response"
                            icon={Clock}
                            color="green"
                        />
                        <KPICard
                            title="Temps Max"
                            value={`${Math.round(data.maxResponseTime)}ms`}
                            subtitle="Peak latency recorded"
                            icon={AlertCircle}
                            color="red"
                        />
                        <KPICard
                            title="Temps Min"
                            value={`${Math.round(data.minResponseTime)}ms`}
                            subtitle="Best performance"
                            icon={TrendingUp}
                            color="purple"
                        />
                    </>
                ) : null}
            </div>

            {/* Recent API Metrics */}
            <div className="bg-white rounded-xl border-2 border-green-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Métriques API Récentes</h3>
                </div>

                {!data ? (
                    <div className="space-y-2">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : data && data.recentMetrics.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Endpoint</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Méthode</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Temps Réponse</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">TTFB</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentMetrics.slice(0, 50).map((metric, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-sm text-gray-900">{metric.endpoint}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                                                {metric.method}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${metric.statusCode < 300 ? 'bg-green-100 text-green-800' :
                                                metric.statusCode < 400 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {metric.statusCode}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">{Math.round(metric.responseTime)}ms</td>
                                        <td className="py-3 px-4 text-gray-700">{metric.ttfb ? Math.round(metric.ttfb) : '-'}ms</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {new Date(metric.createdAt).toLocaleString('fr-FR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>Aucune métrique disponible</p>
                    </div>
                )}
            </div>
        </div >
    );
}
