'use client';

import { useSession } from 'next-auth/react';
import { AlertTriangle, XCircle, AlertOctagon } from 'lucide-react';
import { getErrorStats } from '@/lib/api/telemetry';
import { usePolling } from '@/lib/hooks/usePolling';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';
import { useState } from 'react';

const severityColors = {
    critical: 'bg-red-600 text-white',
    error: 'bg-orange-500 text-white',
    warning: 'bg-yellow-500 text-gray-900',
    info: 'bg-blue-500 text-white',
    debug: 'bg-gray-500 text-white',
};

export default function ErrorsPage() {
    const { data: session } = useSession();
    const [severityFilter, setSeverityFilter] = useState < string > ('');

    const { data, loading, error } = usePolling(
        async () => {
            if (!session?.accessToken) throw new Error('No token');
            return getErrorStats(session.accessToken, undefined, undefined, undefined, severityFilter || undefined);
        },
        5000,
        !!session?.accessToken
    );

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-900 font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-red-700">{error.message}</p>
            </div>
        );
    }

    const criticalCount = data?.bySeverity.find(s => s.severity === 'critical')?.count || 0;
    const errorCount = data?.bySeverity.find(s => s.severity === 'error')?.count || 0;
    const warningCount = data?.bySeverity.find(s => s.severity === 'warning')?.count || 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Erreurs & Crash Reports</h1>
                <p className="text-gray-600">Monitoring des erreurs frontend et backend</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                            title="Total Erreurs"
                            value={data.total}
                            subtitle="Non résolues"
                            icon={AlertTriangle}
                            color="red"
                        />
                        <KPICard
                            title="Critiques"
                            value={criticalCount}
                            subtitle="Priorité haute"
                            icon={AlertOctagon}
                            color="red"
                        />
                        <KPICard
                            title="Erreurs"
                            value={errorCount}
                            subtitle="Niveau standard"
                            icon={XCircle}
                            color="yellow"
                        />
                        <KPICard
                            title="Warnings"
                            value={warningCount}
                            subtitle="Avertissements"
                            icon={AlertTriangle}
                            color="yellow"
                        />
                    </>
                ) : null}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Filtrer par sévérité:</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSeverityFilter('')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!severityFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tous
                        </button>
                        {['critical', 'error', 'warning', 'info', 'debug'].map((sev) => (
                            <button
                                key={sev}
                                onClick={() => setSeverityFilter(sev)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${severityFilter === sev ? severityColors[sev as keyof typeof severityColors] : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {sev.charAt(0).toUpperCase() + sev.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Errors by Type */}
            <div className="bg-white rounded-xl border-2 border-red-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Erreurs par Type</h3>
                </div>

                {loading && !data ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : data && data.byType.length > 0 ? (
                <div className="space-y-3">
                    {data.byType.map((errorType, index) => (
                        <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-gray-900">{errorType.errorType}</div>
                                    <div className="text-sm text-gray-600">{errorType.count} occurrences</div>
                                </div>
                                <div className="text-2xl font-bold text-red-600">{errorType.count}</div>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                <div className="text-center py-12 text-gray-400">
                    <p>Aucune erreur détectée</p>
                </div>
        )}
            </div>

            {/* Error Stats by Severity */}
            <div className="bg-white rounded-xl border-2 border-orange-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-orange-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900">Distribution par Sévérité</h3>
                </div>

                {loading && !data ? (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : data && data.bySeverity.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {data.bySeverity.map((sev, index) => (
                        <div key={index} className={`p-4 rounded-lg ${severityColors[sev.severity as keyof typeof severityColors]}`}>
                            <div className="text-xs font-semibold uppercase opacity-80 mb-2">{sev.severity}</div>
                            <div className="text-3xl font-bold">{sev.count}</div>
                        </div>
                    ))}
                </div>
        ) : null}
            </div>
        </div>
    );
}
