'use client';

import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

interface CountryData {
    country: string;
    sessions: number;
    percentage: number | string;
}

interface WorldHeatmapProps {
    data: CountryData[];
}

// World map GeoJSON topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map country names from backend to ISO country names in the GeoJSON
const COUNTRY_NAME_MAPPING: Record<string, string> = {
    'United States': 'United States of America',
    'United Kingdom': 'United Kingdom',
    'DR Congo': 'Dem. Rep. Congo',
    'Congo': 'Congo',
    'Central African Republic': 'Central African Rep.',
    'Dominican Republic': 'Dominican Rep.',
    'Ivory Coast': "Côte d'Ivoire",
    'Czech Republic': 'Czechia',
    'Bosnia and Herzegovina': 'Bosnia and Herz.',
    'Equatorial Guinea': 'Eq. Guinea',
    'South Sudan': 'S. Sudan',
    'Swaziland': 'eSwatini',
};

export default function WorldHeatmap({ data }: WorldHeatmapProps) {
    const { maxSessions, colorScale, countryDataMap } = useMemo(() => {
        const max = Math.max(...data.map(d => d.sessions), 1);

        const scale = (sessions: number) => {
            const intensity = sessions / max;
            if (intensity > 0.75) return '#1E40AF'; // Dark blue
            if (intensity > 0.5) return '#3B82F6'; // Blue  
            if (intensity > 0.25) return '#60A5FA'; // Light blue
            if (intensity > 0.1) return '#93C5FD'; // Very light blue
            if (intensity > 0) return '#DBEAFE'; // Lightest blue
            return '#E5E7EB'; // Gray for no data
        };

        // Create a map for quick lookup
        const dataMap = new Map<string, CountryData>();
        data.forEach(item => {
            const mappedName = COUNTRY_NAME_MAPPING[item.country] || item.country;
            dataMap.set(mappedName, item);
        });

        return { maxSessions: max, colorScale: scale, countryDataMap: dataMap };
    }, [data]);

    const activeCountries = data.filter(d => d.sessions > 0).length;

    return (
        <div className="relative w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-xl p-4">
            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg z-10 border border-gray-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Sessions</div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#1E40AF] rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Élevé (&gt;75%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#3B82F6] rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Moyen (50-75%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#93C5FD] rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Faible (10-50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#DBEAFE] rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Très faible (&lt;10%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#E5E7EB] dark:bg-slate-700 rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Aucune</span>
                    </div>
                </div>
            </div>

            {/* Real World Map */}
            <div className="w-full" style={{ height: '500px' }}>
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 140,
                        center: [0, 20]
                    }}
                    className="w-full h-full"
                >
                    <ZoomableGroup>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const countryName = geo.properties.name;
                                    const countryData = countryDataMap.get(countryName);
                                    const sessions = countryData?.sessions || 0;
                                    const fillColor = colorScale(sessions);

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={fillColor}
                                            stroke="#94A3B8"
                                            strokeWidth={0.5}
                                            className="outline-none transition-all duration-200 hover:brightness-110 cursor-pointer dark:stroke-slate-600"
                                            style={{
                                                default: { outline: 'none' },
                                                hover: { outline: 'none', fill: sessions > 0 ? fillColor : '#CBD5E1' },
                                                pressed: { outline: 'none' },
                                            }}
                                        >
                                            <title>
                                                {countryName}: {sessions.toLocaleString('fr-FR')} session{sessions !== 1 ? 's' : ''}
                                            </title>
                                        </Geography>
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* Stats at bottom */}
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                🌍 {activeCountries} pays avec sessions • Max: {maxSessions.toLocaleString('fr-FR')} sessions
                {data.length > 0 && (
                    <span className="ml-2 text-xs">
                        • Survol pour détails
                    </span>
                )}
            </div>
        </div>
    );
}
