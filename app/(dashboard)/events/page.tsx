'use client';

import { useSession } from 'next-auth/react';
import { Activity, MousePointer, Eye } from 'lucide-react';
import { useTelemetryEvents } from '@/lib/hooks/useTelemetryWebSocket';
import WebSocketStatus from '@/components/ui/WebSocketStatus';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';

export default function EventsPage() {
    const { data: session } = useSession();
    const { data, error, connected, reconnecting } = useTelemetryEvents();

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-900 font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-red-700">{error.message}</p>
            </div>
        );
    }

    const clickEvents = data?.byType.find(t => t.eventType === 'click')?.count || 0;
    const pageviewEvents = data?.byType.find(t => t.eventType === 'pageview' || t.eventType === 'view')?.count || 0;

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">Flux d&apos;Événements en Direct</h1>
                    <WebSocketStatus connected={connected} reconnecting={reconnecting} />
                </div>
                <p className="text-gray-600">Stream en temps réel des actions utilisateurs</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!data ? (
                    <>
                        <KPISkeleton />
                        <KPISkeleton />
                        <KPISkeleton />
                    </>
                ) : data ? (
                    <>
                        <KPICard
                            title="Total Événements"
                            value={data.total.toLocaleString('fr-FR')}
                            subtitle="Toutes catégories"
                            icon={Activity}
                            color="blue"
                        />
                        <KPICard
                            title="Événements Click"
                            value={clickEvents.toLocaleString('fr-FR')}
                            subtitle="Interactions utilisateur"
                            icon={MousePointer}
                            color="green"
                        />
                        <KPICard
                            title="Pages Vues"
                            value={pageviewEvents.toLocaleString('fr-FR')}
                            subtitle="Navigation"
                            icon={Eye}
                            color="purple"
                        />
                    </>
                ) : null}
            </div>

            {/* Events by Type - List */}
            <div className="bg-white rounded-xl border-2 border-blue-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">Événements par Type</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">En direct</span>
                    </div>
                </div>

                {!data ? (
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                    </div>
                ) : data && data.byType.length > 0 ? (
                    <div className="space-y-3">
                        {data.byType.map((event, index) => (
                            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 capitalize">{event.eventType}</div>
                                            <div className="text-sm text-gray-600">{event.count} occurrences</div>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-blue-600">{event.count}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>Aucun événement détecté</p>
                    </div>
                )}
            </div>
        </div>
    );
}
