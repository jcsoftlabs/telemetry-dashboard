'use client';

import { useState, useEffect } from 'react';
import { FileDown, FileSpreadsheet, Bell, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '@/lib/context/ThemeContext';

interface HeaderProps {
    onExportCSV?: () => void;
    onExportPDF?: () => void;
}

export default function Header({ onExportCSV, onExportPDF }: HeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleExportCSV = () => {
        if (onExportCSV) {
            onExportCSV();
        } else {
            alert('Export CSV sera disponible sur cette page bientôt');
        }
    };

    const handleExportPDF = () => {
        if (onExportPDF) {
            onExportPDF();
        } else {
            alert('Export PDF sera disponible sur cette page bientôt');
        }
    };

    return (
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between transition-colors duration-200">
            {/* Left - Title */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ministère du Tourisme</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">République d&apos;Haïti • Plateforme de Surveillance</p>
            </div>

            {/* Right - Date/Time & Actions */}
            <div className="flex items-center gap-6">
                {/* Date & Time */}
                <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {format(currentTime, 'EEEE dd MMMM yyyy', { locale: fr })}
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {format(currentTime, 'HH:mm:ss')}
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="p-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2 text-sm font-medium transform hover:scale-105 active:scale-95"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Exporter CSV
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="p-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2 text-sm font-medium transform hover:scale-105 active:scale-95"
                    >
                        <FileDown className="w-4 h-4" />
                        Exporter PDF
                    </button>
                </div>

                {/* Notification Icon */}
                <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 transform hover:scale-110">
                    <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 transform hover:scale-110 hover:rotate-12"
                >
                    {theme === 'dark' ? (
                        <Sun className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <Moon className="w-6 h-6 text-gray-700" />
                    )}
                </button>
            </div>
        </header>
    );
}
