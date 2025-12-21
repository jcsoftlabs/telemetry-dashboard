'use client';

import { useMemo } from 'react';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Heart, Star, Share2, MousePointer, TrendingUp, Zap } from 'lucide-react';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';
import WebSocketStatus from '@/components/ui/WebSocketStatus';

interface EventType {
    eventType: string;
    count: number;
}

interface EventData {
    total: number;
    byType: EventType[];
}

interface OverviewData {
    events: EventData;
}

const EVENT_COLORS: { [key: string]: string } = {
    click: '#3b82f6',
    view: '#10b981',
    share: '#f59e0b',
    favorite: '#ef4444',
    conversion: '#8b5cf6',
    default: '#6b7280'
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function EngagementPage() {
    const { data: overviewData, connected, reconnecting } = useWebSocket<OverviewData>('telemetry:overview');
    const { data: eventData } = useWebSocket<EventData>('telemetry:events');

    // WebSocket sends data directly, not wrapped in { data: ... }
    const events = eventData || overviewData?.events;

    // Calculate engagement metrics
    const engagementMetrics = useMemo(() => {
        if (!events) return { clicks: 0, views: 0, shares: 0, favorites: 0 };

        const metrics = { clicks: 0, views: 0, shares: 0, favorites: 0 };

        events.byType.forEach(event => {
            const type = event.eventType.toLowerCase();
            if (type.includes('click')) metrics.clicks += event.count;
            else if (type.includes('view') || type.includes('pageview')) metrics.views += event.count;
            else if (type.includes('share')) metrics.shares += event.count;
            else if (type.includes('favorite') || type.includes('like')) metrics.favorites += event.count;
        });

        return metrics;
    }, [events]);

    const engagementRate = useMemo(() => {
        if (!events || events.total === 0) return 0;
        const interactionEvents = engagementMetrics.clicks + engagementMetrics.shares + engagementMetrics.favorites;
        return Math.round((interactionEvents / events.total) * 100);
    }, [events, engagementMetrics]);

    const eventChartData = useMemo(() => {
        if (!events) return [];
        return events.byType.map(item => ({
            name: item.eventType,
            count: item.count
        }));
    }, [events]);

    const getEventIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('click')) return <MousePointer className="w-4 h-4" />;
        if (lowerType.includes('share')) return <Share2 className="w-4 h-4" />;
        if (lowerType.includes('favorite') || lowerType.includes('like')) return <Heart className="w-4 h-4" />;
        if (lowerType.includes('view')) return <Star className="w-4 h-4" />;
        return <Zap className="w-4 h-4" />;
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Heart className="w-8 h-8 text-red-600" />
                        Engagement Utilisateur
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Analyse des interactions et de l'engagement
                    </p>
                </div>
                <WebSocketStatus connected={connected} reconnecting={reconnecting} />
            </div>

            {/* KPIs */}
            {!events ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <KPISkeleton key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Total Interactions"
                        value={events.total}
                        icon={Zap}
                        color="purple"
                    />
                    <KPICard
                        title="Clics"
                        value={engagementMetrics.clicks}
                        icon={MousePointer}
                        color="blue"
                    />
                    <KPICard
                        title="Partages"
                        value={engagementMetrics.shares}
                        icon={Share2}
                        color="yellow"
                    />
                    <KPICard
                        title="Favoris"
                        value={engagementMetrics.favorites}
                        icon={Heart}
                        color="red"
                    />
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Distribution des Événements
                    </h3>
                    {!events ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-pulse text-gray-400">Chargement...</div>
                        </div>
                    ) : events.byType.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            Aucune donnée disponible
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={eventChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.name}: ${entry.count}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {eventChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Event Volume */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Volume par Type
                    </h3>
                    {!events ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-pulse text-gray-400">Chargement...</div>
                        </div>
                    ) : events.byType.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            Aucune donnée disponible
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={eventChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8b5cf6" name="Événements" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Event Details List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Détails des Interactions
                </h3>
                <div className="space-y-3">
                    {!events ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))
                    ) : events.byType.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                            Aucune interaction enregistrée
                        </p>
                    ) : (
                        events.byType.map((event, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
                                        {getEventIcon(event.eventType)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {event.eventType}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Type d'interaction utilisateur
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {event.count}
                                        </div>
                                        <div className="text-xs text-gray-500">événements</div>
                                    </div>
                                    <div className="w-32 bg-gray-200 dark:bg-slate-600 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                                            style={{
                                                width: `${events.total > 0 ? (event.count / events.total) * 100 : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Engagement Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Rate */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Taux d'Engagement
                            </h4>
                            <div className="text-3xl font-bold text-purple-600 mb-1">
                                {engagementRate}%
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Interactions actives vs totales
                            </p>
                        </div>
                    </div>
                </div>

                {/* Most Popular Action */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Action Populaire
                            </h4>
                            <div className="text-xl font-bold text-blue-600 mb-1 truncate">
                                {events?.byType[0]?.eventType || 'N/A'}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {events?.byType[0]?.count || 0} fois
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Unique Events */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Types d'Événements
                            </h4>
                            <div className="text-3xl font-bold text-green-600 mb-1">
                                {events?.byType.length || 0}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                Actions différentes trackées
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Métriques d'Engagement
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            L'engagement mesure comment les utilisateurs interagissent avec votre plateforme.
                            Un taux élevé indique un contenu pertinent et une bonne expérience utilisateur.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                💡 Insights comportementaux
                            </span>
                            <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                📊 Optimisation continue
                            </span>
                            <span className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                🎯 Actions mesurables
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner when no data */}
            {events && events.total === 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune interaction enregistrée
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Les données d'engagement apparaîtront ici dès que les utilisateurs
                                commenceront à interagir avec votre contenu (clics, partages, favoris, etc.).
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
