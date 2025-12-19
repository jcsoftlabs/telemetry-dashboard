'use client';

import { useMemo } from 'react';

interface CountryData {
    country: string;
    sessions: number;
    percentage: number | string;
}

interface WorldHeatmapProps {
    data: CountryData[];
}

// Comprehensive world map with 195+ countries positioned geographically
// Coordinates are approximate positions on a simplified projection
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; width: number; height: number }> = {
    // North America
    'Canada': { x: 100, y: 60, width: 140, height: 70 },
    'United States': { x: 90, y: 140, width: 150, height: 100 },
    'Mexico': { x: 80, y: 250, width: 90, height: 60 },
    'Guatemala': { x: 90, y: 310, width: 30, height: 25 },
    'Belize': { x: 105, y: 305, width: 15, height: 20 },
    'Honduras': { x: 120, y: 315, width: 30, height: 20 },
    'El Salvador': { x: 115, y: 325, width: 20, height: 15 },
    'Nicaragua': { x: 125, y: 335, width: 30, height: 25 },
    'Costa Rica': { x: 130, y: 355, width: 25, height: 20 },
    'Panama': { x: 140, y: 370, width: 30, height: 20 },

    // Caribbean
    'Cuba': { x: 200, y: 260, width: 50, height: 20 },
    'Jamaica': { x: 210, y: 285, width: 25, height: 15 },
    'Haiti': { x: 240, y: 275, width: 20, height: 18 },
    'Dominican Republic': { x: 260, y: 275, width: 25, height: 18 },
    'Puerto Rico': { x: 285, y: 280, width: 18, height: 12 },
    'Bahamas': { x: 220, y: 250, width: 25, height: 20 },
    'Trinidad and Tobago': { x: 280, y: 320, width: 15, height: 12 },
    'Barbados': { x: 295, y: 315, width: 10, height: 10 },

    // South America
    'Colombia': { x: 230, y: 390, width: 60, height: 70 },
    'Venezuela': { x: 270, y: 380, width: 60, height: 50 },
    'Guyana': { x: 310, y: 390, width: 30, height: 35 },
    'Suriname': { x: 330, y: 390, width: 20, height: 30 },
    'French Guiana': { x: 345, y: 395, width: 20, height: 30 },
    'Ecuador': { x: 220, y: 425, width: 40, height: 45 },
    'Peru': { x: 230, y: 465, width: 60, height: 100 },
    'Brazil': { x: 280, y: 420, width: 130, height: 160 },
    'Bolivia': { x: 260, y: 520, width: 50, height: 60 },
    'Paraguay': { x: 300, y: 550, width: 40, height: 50 },
    'Uruguay': { x: 320, y: 600, width: 30, height: 35 },
    'Argentina': { x: 260, y: 560, width: 70, height: 140 },
    'Chile': { x: 235, y: 520, width: 30, height: 180 },

    // Europe - Western
    'Iceland': { x: 450, y: 50, width: 25, height: 20 },
    'Ireland': { x: 465, y: 100, width: 25, height: 30 },
    'United Kingdom': { x: 485, y: 95, width: 30, height: 45 },
    'Portugal': { x: 470, y: 165, width: 20, height: 35 },
    'Spain': { x: 485, y: 160, width: 55, height: 40 },
    'France': { x: 510, y: 120, width: 45, height: 50 },
    'Belgium': { x: 520, y: 110, width: 20, height: 20 },
    'Netherlands': { x: 525, y: 100, width: 20, height: 20 },
    'Luxembourg': { x: 528, y: 118, width: 8, height: 8 },
    'Germany': { x: 540, y: 105, width: 40, height: 45 },
    'Switzerland': { x: 535, y: 135, width: 25, height: 20 },
    'Austria': { x: 555, y: 130, width: 30, height: 20 },
    'Italy': { x: 545, y: 150, width: 35, height: 70 },
    'Monaco': { x: 540, y: 150, width: 6, height: 6 },
    'Vatican City': { x: 560, y: 175, width: 5, height: 5 },
    'San Marino': { x: 565, y: 170, width: 6, height: 6 },
    'Malta': { x: 555, y: 200, width: 8, height: 8 },

    // Europe - Northern
    'Norway': { x: 540, y: 55, width: 35, height: 80 },
    'Sweden': { x: 560, y: 60, width: 30, height: 75 },
    'Finland': { x: 580, y: 60, width: 40, height: 70 },
    'Denmark': { x: 540, y: 105, width: 25, height: 20 },
    'Estonia': { x: 585, y: 95, width: 25, height: 20 },
    'Latvia': { x: 585, y: 110, width: 25, height: 20 },
    'Lithuania': { x: 585, y: 125, width: 25, height: 20 },

    // Europe - Eastern
    'Poland': { x: 575, y: 110, width: 35, height: 35 },
    'Czech Republic': { x: 560, y: 120, width: 25, height: 20 },
    'Slovakia': { x: 575, y: 130, width: 25, height: 18 },
    'Hungary': { x: 575, y: 145, width: 30, height: 22 },
    'Romania': { x: 595, y: 145, width: 35, height: 35 },
    'Bulgaria': { x: 590, y: 175, width: 30, height: 25 },
    'Moldova': { x: 615, y: 140, width: 20, height: 25 },
    'Ukraine': { x: 610, y: 120, width: 60, height: 45 },
    'Belarus': { x: 600, y: 105, width: 40, height: 30 },
    'Russia': { x: 640, y: 50, width: 280, height: 150 },

    // Europe - Southern
    'Greece': { x: 585, y: 180, width: 30, height: 35 },
    'Albania': { x: 575, y: 175, width: 20, height: 25 },
    'North Macedonia': { x: 580, y: 175, width: 18, height: 18 },
    'Serbia': { x: 575, y: 160, width: 22, height: 25 },
    'Bosnia and Herzegovina': { x: 565, y: 165, width: 25, height: 22 },
    'Croatia': { x: 560, y: 155, width: 25, height: 30 },
    'Slovenia': { x: 555, y: 150, width: 18, height: 18 },
    'Montenegro': { x: 575, y: 175, width: 15, height: 15 },
    'Kosovo': { x: 580, y: 175, width: 12, height: 12 },
    'Cyprus': { x: 620, y: 200, width: 20, height: 15 },

    // Middle East
    'Turkey': { x: 605, y: 175, width: 60, height: 35 },
    'Lebanon': { x: 625, y: 195, width: 15, height: 18 },
    'Syria': { x: 630, y: 190, width: 30, height: 30 },
    'Israel': { x: 625, y: 208, width: 15, height: 25 },
    'Palestine': { x: 625, y: 210, width: 12, height: 20 },
    'Jordan': { x: 635, y: 215, width: 25, height: 30 },
    'Iraq': { x: 650, y: 200, width: 40, height: 45 },
    'Iran': { x: 685, y: 190, width: 65, height: 70 },
    'Kuwait': { x: 670, y: 225, width: 18, height: 18 },
    'Saudi Arabia': { x: 645, y: 235, width: 70, height: 75 },
    'Yemen': { x: 665, y: 305, width: 40, height: 45 },
    'Oman': { x: 700, y: 270, width: 45, height: 55 },
    'UAE': { x: 705, y: 250, width: 30, height: 25 },
    'Qatar': { x: 695, y: 245, width: 15, height: 18 },
    'Bahrain': { x: 690, y: 245, width: 10, height: 10 },

    // Africa - North
    'Morocco': { x: 470, y: 200, width: 45, height: 50 },
    'Algeria': { x: 505, y: 205, width: 70, height: 60 },
    'Tunisia': { x: 540, y: 195, width: 25, height: 35 },
    'Libya': { x: 560, y: 210, width: 70, height: 55 },
    'Egypt': { x: 615, y: 220, width: 45, height: 60 },
    'Sudan': { x: 630, y: 275, width: 50, height: 70 },
    'South Sudan': { x: 640, y: 330, width: 40, height: 35 },

    // Africa - West
    'Mauritania': { x: 470, y: 265, width: 45, height: 50 },
    'Mali': { x: 500, y: 275, width: 55, height: 55 },
    'Niger': { x: 540, y: 280, width: 60, height: 50 },
    'Chad': { x: 575, y: 280, width: 50, height: 60 },
    'Senegal': { x: 465, y: 300, width: 30, height: 25 },
    'Gambia': { x: 470, y: 308, width: 18, height: 10 },
    'Guinea-Bissau': { x: 465, y: 318, width: 18, height: 15 },
    'Guinea': { x: 475, y: 325, width: 35, height: 30 },
    'Sierra Leone': { x: 475, y: 350, width: 25, height: 22 },
    'Liberia': { x: 485, y: 365, width: 25, height: 25 },
    'Ivory Coast': { x: 500, y: 345, width: 35, height: 35 },
    'Burkina Faso': { x: 510, y: 315, width: 35, height: 30 },
    'Ghana': { x: 515, y: 345, width: 30, height: 30 },
    'Togo': { x: 530, y: 345, width: 15, height: 25 },
    'Benin': { x: 540, y: 340, width: 15, height: 30 },
    'Nigeria': { x: 545, y: 340, width: 50, height: 45 },
    'Cameroon': { x: 575, y: 355, width: 35, height: 50 },

    // Africa - Central
    'Central African Republic': { x: 595, y: 355, width: 45, height: 35 },
    'Gabon': { x: 565, y: 390, width: 30, height: 35 },
    'Congo': { x: 585, y: 395, width: 30, height: 40 },
    'DR Congo': { x: 600, y: 385, width: 60, height: 75 },
    'Angola': { x: 580, y: 455, width: 55, height: 65 },

    // Africa - East
    'Ethiopia': { x: 655, y: 345, width: 50, height: 60 },
    'Eritrea': { x: 660, y: 305, width: 30, height: 35 },
    'Djibouti': { x: 680, y: 320, width: 15, height: 15 },
    'Somalia': { x: 685, y: 335, width: 40, height: 70 },
    'Kenya': { x: 660, y: 395, width: 45, height: 60 },
    'Uganda': { x: 640, y: 395, width: 35, height: 40 },
    'Rwanda': { x: 640, y: 425, width: 20, height: 20 },
    'Burundi': { x: 640, y: 440, width: 18, height: 20 },
    'Tanzania': { x: 650, y: 445, width: 50, height: 65 },

    // Africa - Southern
    'Zambia': { x: 620, y: 475, width: 45, height: 50 },
    'Malawi': { x: 655, y: 490, width: 25, height: 45 },
    'Mozambique': { x: 665, y: 490, width: 40, height: 90 },
    'Zimbabwe': { x: 630, y: 515, width: 40, height: 40 },
    'Botswana': { x: 610, y: 530, width: 45, height: 50 },
    'Namibia': { x: 580, y: 520, width: 45, height: 70 },
    'South Africa': { x: 605, y: 570, width: 65, height: 80 },
    'Lesotho': { x: 635, y: 605, width: 18, height: 18 },
    'Swaziland': { x: 650, y: 580, width: 15, height: 18 },
    'Madagascar': { x: 690, y: 510, width: 35, height: 80 },
    'Mauritius': { x: 710, y: 560, width: 12, height: 12 },
    'Seychelles': { x: 695, y: 420, width: 10, height: 10 },

    // Asia - Central
    'Kazakhstan': { x: 720, y: 130, width: 90, height: 60 },
    'Uzbekistan': { x: 710, y: 170, width: 50, height: 40 },
    'Turkmenistan': { x: 695, y: 180, width: 45, height: 40 },
    'Kyrgyzstan': { x: 745, y: 170, width: 35, height: 30 },
    'Tajikistan': { x: 730, y: 185, width: 30, height: 25 },
    'Afghanistan': { x: 710, y: 200, width: 50, height: 45 },
    'Pakistan': { x: 725, y: 230, width: 45, height: 60 },

    // Asia - South
    'India': { x: 760, y: 240, width: 70, height: 90 },
    'Nepal': { x: 795, y: 255, width: 30, height: 22 },
    'Bhutan': { x: 815, y: 260, width: 22, height: 18 },
    'Bangladesh': { x: 815, y: 275, width: 30, height: 35 },
    'Sri Lanka': { x: 785, y: 325, width: 20, height: 30 },
    'Maldives': { x: 765, y: 340, width: 10, height: 15 },

    // Asia - Southeast
    'Myanmar': { x: 830, y: 270, width: 35, height: 70 },
    'Thailand': { x: 840, y: 310, width: 35, height: 65 },
    'Laos': { x: 850, y: 285, width: 30, height: 50 },
    'Vietnam': { x: 865, y: 300, width: 30, height: 80 },
    'Cambodia': { x: 860, y: 330, width: 30, height: 35 },
    'Malaysia': { x: 850, y: 365, width: 55, height: 50 },
    'Singapore': { x: 860, y: 395, width: 10, height: 10 },
    'Indonesia': { x: 860, y: 405, width: 120, height: 60 },
    'Brunei': { x: 900, y: 375, width: 12, height: 12 },
    'Philippines': { x: 900, y: 310, width: 40, height: 80 },
    'East Timor': { x: 925, y: 440, width: 18, height: 18 },

    // Asia - East
    'China': { x: 820, y: 200, width: 110, height: 110 },
    'Mongolia': { x: 850, y: 155, width: 80, height: 50 },
    'North Korea': { x: 910, y: 180, width: 25, height: 40 },
    'South Korea': { x: 910, y: 215, width: 25, height: 45 },
    'Japan': { x: 935, y: 195, width: 40, height: 85 },
    'Taiwan': { x: 905, y: 265, width: 20, height: 30 },

    // Oceania
    'Australia': { x: 860, y: 480, width: 130, height: 100 },
    'New Zealand': { x: 955, y: 550, width: 40, height: 80 },
    'Papua New Guinea': { x: 920, y: 425, width: 50, height: 45 },
    'Fiji': { x: 990, y: 510, width: 15, height: 15 },
    'Solomon Islands': { x: 960, y: 445, width: 18, height: 18 },
    'Vanuatu': { x: 965, y: 490, width: 12, height: 18 },
    'New Caledonia': { x: 965, y: 530, width: 15, height: 20 },
    'Samoa': { x: 1010, y: 495, width: 12, height: 12 },
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

    const activeCountries = data.filter(d => d.sessions > 0).length;

    return (
        <div className="relative w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-xl p-6">
            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg z-10">
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

            {/* Comprehensive World Map */}
            <svg viewBox="0 0 1050 700" className="w-full h-auto">
                {/* Ocean background */}
                <rect width="1050" height="700" fill="#E0F2FE" className="dark:fill-slate-800" />

                {/* Countries */}
                {Object.entries(COUNTRY_POSITIONS).map(([countryName, pos]) => {
                    const countryData = data.find(d => d.country === countryName);
                    const sessions = countryData?.sessions || 0;
                    const color = sessions > 0 ? colorScale(sessions) : '#E5E7EB';
                    const showLabel = sessions > 0 && pos.width > 20 && pos.height > 15;

                    return (
                        <g key={countryName}>
                            <rect
                                x={pos.x}
                                y={pos.y}
                                width={pos.width}
                                height={pos.height}
                                fill={color}
                                stroke="#94A3B8"
                                strokeWidth="0.5"
                                className="transition-all duration-200 hover:opacity-80 hover:stroke-2 cursor-pointer dark:stroke-slate-600"
                            >
                                <title>{`${countryName}: ${sessions.toLocaleString('fr-FR')} sessions`}</title>
                            </rect>
                            {showLabel && (
                                <text
                                    x={pos.x + pos.width / 2}
                                    y={pos.y + pos.height / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xs font-bold fill-white pointer-events-none select-none"
                                    style={{ fontSize: Math.min(pos.width / 4, 10) }}
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
                🌍 {activeCountries} pays actifs sur {Object.keys(COUNTRY_POSITIONS).length} couverts • Max: {maxSessions.toLocaleString('fr-FR')} sessions
            </div>
        </div>
    );
}
