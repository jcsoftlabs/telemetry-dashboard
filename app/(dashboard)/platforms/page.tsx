'use client';

import { useMemo } from 'react';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smartphone, Monitor, Tablet, TrendingUp, Users, Clock } from 'lucide-react';
import KPICard from '@/components/charts/KPICard';
import KPISkeleton from '@/components/skeletons/KPISkeleton';
import WebSocketStatus from '@/components/ui/WebSocketStatus';

interface DeviceType {
    deviceType: string;
    count: number;
    percentage: number;
}

interface OSType {
    os: string;
    count: number;
    percentage: number;
}

interface BrowserType {
    browser: string;
    count: number;
    percentage: number;
}

interface DeviceData {
    total: number;
    byDeviceType: DeviceType[];
    byOS: OSType[];
    byBrowser: BrowserType[];
}

const DEVICE_COLORS = {
    mobile: '#10b981',
    desktop: '#3b82f6',
    tablet: '#f59e0b',
    unknown: '#6b7280'
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function PlatformComparisonPage() {
    const { data, connected, reconnecting } = useWebSocket<DeviceData>('telemetry:devices');

    // WebSocket sends data directly, not wrapped in { data: ... }
    const deviceData = data;

    // Calculate platform stats
    const platformStats = useMemo(() => {
        if (!deviceData) return { mobile: 0, desktop: 0, tablet: 0 };

        const stats = { mobile: 0, desktop: 0, tablet: 0 };
        deviceData.byDeviceType.forEach(device => {
            const type = device.deviceType.toLowerCase();
            if (type.includes('mobile') || type.includes('phone')) {
                stats.mobile += device.count;
            } else if (type.includes('desktop') || type.includes('pc')) {
                stats.desktop += device.count;
            } else if (type.includes('tablet')) {
                stats.tablet += device.count;
            }
        });

        return stats;
    }, [deviceData]);

    const mobilePercentage = useMemo(() => {
        if (!deviceData || deviceData.total === 0) return 0;
        return Math.round((platformStats.mobile / deviceData.total) * 100);
    }, [deviceData, platformStats]);

    const deviceTypeChartData = useMemo(() => {
        if (!deviceData) return [];
        return deviceData.byDeviceType.map(item => ({
            name: item.deviceType,
            value: item.count,
            percentage: item.percentage
        }));
    }, [deviceData]);

    const getDeviceIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('mobile') || lowerType.includes('phone')) {
            return <Smartphone className="w-4 h-4" />;
        } else if (lowerType.includes('tablet')) {
            return <Tablet className="w-4 h-4" />;
        } else {
            return <Monitor className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Smartphone className="w-8 h-8 text-blue-600" />
                        Comparaison des Plateformes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Analyse du comportement utilisateur par type d'appareil
                    </p>
                </div>
                <WebSocketStatus connected={connected} reconnecting={reconnecting} />
            </div>

            {/* KPIs */}
            {!deviceData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <KPISkeleton key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Total Appareils"
                        value={deviceData.total}
                        icon={Users}
                        color="blue"
                    />
                    <KPICard
                        title="Mobile"
                        value={platformStats.mobile}
                        icon={Smartphone}
                        color="green"
                        subtitle={`${mobilePercentage}% du total`}
                    />
                    <KPICard
                        title="Desktop"
                        value={platformStats.desktop}
                        icon={Monitor}
                        color="blue"
                    />
                    <KPICard
                        title="Tablette"
                        value={platformStats.tablet}
                        icon={Tablet}
                        color="yellow"
                    />
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Device Type Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Distribution par Type d'Appareil
                    </h3>
                    {!deviceData ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-pulse text-gray-400">Chargement...</div>
                        </div>
                    ) : deviceData.byDeviceType.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            Aucune donnée disponible
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={deviceTypeChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.name}: ${entry.percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {deviceTypeChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Operating Systems */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Systèmes d'Exploitation
                    </h3>
                    {!deviceData ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-pulse text-gray-400">Chargement...</div>
                        </div>
                    ) : deviceData.byOS.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            Aucune donnée disponible
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={deviceData.byOS}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="os" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#3b82f6" name="Appareils" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Detailed Stats Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Browsers */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Navigateurs Populaires
                    </h3>
                    <div className="space-y-3">
                        {!deviceData ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))
                        ) : deviceData.byBrowser.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                Aucune donnée disponible
                            </p>
                        ) : (
                            deviceData.byBrowser.map((browser, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {browser.browser}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {browser.count} utilisateurs • {browser.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${browser.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Device Types Detail */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Types d'Appareils
                    </h3>
                    <div className="space-y-3">
                        {!deviceData ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))
                        ) : deviceData.byDeviceType.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                Aucune donnée disponible
                            </p>
                        ) : (
                            deviceData.byDeviceType.map((device, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                                            {getDeviceIcon(device.deviceType)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {device.deviceType}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {device.count} appareils • {device.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${device.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Platform Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Insights Multi-Plateformes
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mobilité</div>
                                <div className="text-2xl font-bold text-blue-600">{mobilePercentage}%</div>
                                <div className="text-xs text-gray-500 mt-1">des utilisateurs sur mobile</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">OS Principal</div>
                                <div className="text-lg font-bold text-green-600">
                                    {deviceData?.byOS[0]?.os || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {deviceData?.byOS[0]?.percentage || 0}% des appareils
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Navigateur #1</div>
                                <div className="text-lg font-bold text-purple-600">
                                    {deviceData?.byBrowser[0]?.browser || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {deviceData?.byBrowser[0]?.percentage || 0}% d'utilisation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Banner when no data */}
            {deviceData && deviceData.total === 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune donnée d'appareil pour le moment
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Les statistiques de plateformes apparaîtront ici dès que des utilisateurs
                                commenceront à utiliser votre application mobile ou votre site web.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
