'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Activity,
    TrendingUp,
    AlertTriangle,
    Users,
    FileText,
    LogOut,
    Globe
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Analytics Géo', href: '/analytics-geo', icon: Globe },
    { name: 'Événements', href: '/events', icon: Activity },
    { name: 'Performance', href: '/performance', icon: TrendingUp },
    { name: 'Erreurs', href: '/errors', icon: AlertTriangle },
    { name: 'Sessions', href: '/sessions', icon: Users },
    { name: 'Rapports', href: '/reports', icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 transition-colors duration-200">
            {/* Logo / Header */}
            <div className="p-6 border-b border-slate-700 dark:border-slate-800">
                <h1 className="text-xl font-bold mb-1 animate-fadeIn">RÉPUBLIQUE D&apos;HAÏTI</h1>
                <p className="text-sm text-slate-400 animate-fadeIn animation-delay-100">Plateforme de Surveillance</p>
            </div>

            {/* Secure Access Badge */}
            <div className="mx-6 mt-6 mb-4 animate-fadeIn animation-delay-200">
                <div className="bg-red-600 dark:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 hover:bg-red-700 dark:hover:bg-red-600 hover:scale-105">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ACCÈS SÉCURISÉ
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 animate-slideIn
                ${isActive
                                    ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg shadow-blue-600/30 scale-105'
                                    : 'text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800 hover:text-white hover:translate-x-1'
                                }
              `}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Admin Footer */}
            <div className="p-6 border-t border-slate-700 dark:border-slate-800 animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-bold transition-transform duration-300 hover:scale-110 hover:rotate-12">
                        A
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Administrateur</div>
                        <div className="text-xs text-slate-400">Niveau Sécurité Max</div>
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 rounded-lg transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </div>
    );
}
