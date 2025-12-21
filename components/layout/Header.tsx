'use client';

import { useState, useEffect } from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '@/lib/context/ThemeContext';

export default function Header() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                        {mounted ? format(currentTime, 'EEEE dd MMMM yyyy', { locale: fr }) : '—'}
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {mounted ? format(currentTime, 'HH:mm:ss') : '—:—:—'}
                    </div>
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
