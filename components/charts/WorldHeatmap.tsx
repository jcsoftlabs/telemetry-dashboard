'use client';

import { useMemo } from 'react';

interface CountryData {
    country: string;
    sessions: number;
    percentage: number;
}

interface WorldHeatmapProps {
    data: CountryData[];
}

// Simplified world map with major countries as rectangles (visual representation)
// In production, you'd use actual country SVG paths
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; width: number; height: number }> = {
    'United States': { x: 100, y: 150, width: 120, height: 80 },
    'Canada': { x: 100, y: 80, width: 120, height: 60 },
    'Mexico': { x: 100, y: 240, width: 80, height: 50 },
    'Brazil': { x: 280, y: 290, width: 100, height: 120 },
    'United Kingdom': { x: 450, y: 110, width: 40, height: 40 },
    'France': { x: 490, y: 130, width: 50, height: 50 },
    'Germany': { x: 520, y: 110, width: 50, height: 50 },
    'Spain': { x: 470, y: 160, width: 60, height: 45 },
    'Italy': { x: 540, y: 150, width: 40, height: 60 },
    'Russia': { x: 580, y: 80, width: 200, height: 100 },
    'China': { x: 720, y: 140, width: 120, height: 100 },
    'Japan': { x: 860, y: 150, width: 50, height: 70 },
    'India': { x: 660, y: 180, width: 80, height: 90 },
    'Australia': { x: 800, y: 340, width: 120, height: 80 },
    'South Africa': { x: 540, y: 360, width: 60, height: 70 },
    'Egypt': { x: 530, y: 200, width: 45, height: 50 },
    'Nigeria': { x: 490, y: 260, width: 50, height: 50 },
    'Argentina': { x: 260, y: 380, width: 70, height: 100 },
    'Colombia': { x: 240, y: 260, width: 55, height: 60 },
    'Turkey': { x: 550, y: 160, width: 60, height: 40 },
    'South Korea': { x: 810, y: 150, width: 35, height: 50 },
    'Thailand': { x: 720, y: 230, width: 45, height: 60 },
    'Vietnam': { x: 740, y: 220, width: 40, height: 70 },
    'Indonesia': { x: 740, y: 280, width: 110, height: 50 },
    'Philippines': { x: 800, y: 240, width: 45, height: 65 },
    'Saudi Arabia': { x: 580, y: 200, width: 70, height: 60 },
    'UAE': { x: 610, y: 210, width: 35, height: 30 },
    'Haiti': { x: 240, y: 220, width: 25, height: 20 },
};

export default function WorldHeatmap({ data }: WorldHeatmapProps) {
    const { maxSessions, colorScale } = useMemo(() => {
        const max = Math.max(...data.map(d => d.sessions), 1);

        const scale = (sessions: number) => {
            const intensity = sessions / max;
            if (intensity > 0.75) return '#1E40AF'; // Dark blue
            if (intensity > 0.5) return '#3B82F6'; // Blue
            if (intensity > 0.25) return '#60A5FA'; // Light blue
            if (intensity > 0.1) return '#93C5FD'; // Very light blue
            return '#DBEAFE'; // Lightest blue
        };

        return { maxSessions: max, colorScale: scale };
    }, [data]);

    return (
        <div className="relative w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-xl p-6">
            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Sessions</div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#1E40AF] rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Élevé</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#3B82F6] rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Moyen</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#93C5FD] rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Faible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-3 bg-[#E5E7EB] dark:bg-slate-700 rounded"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Aucune</span>
                    </div>
                </div>
            </div>

            {/* Simplified World Map */}
            <svg viewBox="0 0 1000 500" className="w-full h-auto">
                {/* Ocean background */}
                <rect width="1000" height="500" fill="#E0F2FE" className="dark:fill-slate-800" />

                {/* Countries */}
                {Object.entries(COUNTRY_POSITIONS).map(([countryName, pos]) => {
                    const countryData = data.find(d => d.country === countryName);
                    const sessions = countryData?.sessions || 0;
                    const color = sessions > 0 ? colorScale(sessions) : '#E5E7EB';

                    return (
                        <g key={countryName}>
                            <rect
                                x={pos.x}
                                y={pos.y}
                                width={pos.width}
                                height={pos.height}
                                fill={color}
                                stroke="#94A3B8"
                                strokeWidth="1"
                                className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                            >
                                <title>{`${countryName}: ${sessions.toLocaleString()} sessions`}</title>
                            </rect>
                            {sessions > 0 && (
                                <text
                                    x={pos.x + pos.width / 2}
                                    y={pos.y + pos.height / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xs font-bold fill-white pointer-events-none"
                                    style={{ fontSize: Math.min(pos.width / 3, 12) }}
                                >
                                    {sessions}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Stats at bottom */}
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                🌍 {data.length} pays avec des sessions activés • Max: {maxSessions.toLocaleString()} sessions
            </div>
        </div>
    );
}
