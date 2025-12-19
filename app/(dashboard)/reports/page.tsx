'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, Users, Activity, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getOverviewStats, getGeoStats, getSessionStats, getEventStats } from '@/lib/api/telemetry';
import { exportToPDF, exportToCSV } from '@/lib/utils/export';

type ReportType = 'overview' | 'geographic' | 'sessions' | 'events';

interface ReportTemplate {
    id: ReportType;
    name: string;
    description: string;
    icon: any;
    color: string;
}

const reportTemplates: ReportTemplate[] = [
    {
        id: 'overview',
        name: 'Rapport Vue d\'Ensemble',
        description: 'Statistiques globales et métriques clés du dashboard',
        icon: TrendingUp,
        color: 'blue'
    },
    {
        id: 'geographic',
        name: 'Rapport Géographique',
        description: 'Distribution des visiteurs par pays et ville',
        icon: MapPin,
        color: 'green'
    },
    {
        id: 'sessions',
        name: 'Rapport Sessions',
        description: 'Analyse des sessions utilisateurs et comportements',
        icon: Users,
        color: 'purple'
    },
    {
        id: 'events',
        name: 'Rapport Événements',
        description: 'Détails des événements trackés et interactions',
        icon: Activity,
        color: 'orange'
    }
];

export default function ReportsPage() {
    const { data: session } = useSession();
    const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [generating, setGenerating] = useState(false);

    const generateReport = async (format: 'csv' | 'pdf') => {
        if (!selectedReport || !session?.accessToken) return;

        setGenerating(true);
        try {
            let data;
            let filename = `rapport_${selectedReport}_${new Date().toISOString().split('T')[0]}`;

            // Fetch data based on report type
            switch (selectedReport) {
                case 'overview':
                    data = await getOverviewStats(session.accessToken, startDate, endDate);
                    break;
                case 'geographic':
                    data = await getGeoStats(session.accessToken, startDate, endDate);
                    break;
                case 'sessions':
                    data = await getSessionStats(session.accessToken, startDate, endDate);
                    break;
                case 'events':
                    data = await getEventStats(session.accessToken, startDate, endDate);
                    break;
            }

            // Export in selected format
            if (format === 'csv') {
                exportToCSV(data, filename);
            } else {
                exportToPDF(data, filename);
            }
        } catch (error) {
            console.error('Erreur génération rapport:', error);
            alert('Erreur lors de la génération du rapport');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Rapports & Exports</h1>
                <p className="text-gray-600 dark:text-gray-400">Générez des rapports personnalisés et exportez vos données</p>
            </div>

            {/* Date Filter */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Période du Rapport</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date de début
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date de fin
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Report Templates */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Modèles de Rapports</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reportTemplates.map((template) => {
                        const Icon = template.icon;
                        const isSelected = selectedReport === template.id;

                        return (
                            <button
                                key={template.id}
                                onClick={() => setSelectedReport(template.id)}
                                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                                        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${`bg-${template.color}-100 dark:bg-${template.color}-900/20`
                                    }`}>
                                    <Icon className={`w-6 h-6 text-${template.color}-600 dark:text-${template.color}-400`} />
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{template.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Export Actions */}
            {selectedReport && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Générer: {reportTemplates.find(t => t.id === selectedReport)?.name}
                            </h3>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => generateReport('csv')}
                            disabled={generating}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Download className="w-5 h-5" />
                            {generating ? 'Génération...' : 'Exporter en CSV'}
                        </button>
                        <button
                            onClick={() => generateReport('pdf')}
                            disabled={generating}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Download className="w-5 h-5" />
                            {generating ? 'Génération...' : 'Exporter en PDF'}
                        </button>
                    </div>

                    {(!startDate || !endDate) && (
                        <p className="mt-4 text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
                            💡 Astuce: Sélectionnez une période pour filtrer les données du rapport
                        </p>
                    )}
                </div>
            )}

            {/* Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">ℹ️ À propos des rapports</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Les rapports CSV contiennent toutes les données brutes pour analyse</li>
                    <li>• Les rapports PDF incluent des graphiques et visualisations</li>
                    <li>• Les données sont filtrées selon la période sélectionnée</li>
                    <li>• Les rapports sont générés en temps réel depuis la base de données</li>
                </ul>
            </div>
        </div>
    );
}
