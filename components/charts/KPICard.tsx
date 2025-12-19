import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100',
};

const iconColorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
    green: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
    red: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300',
    purple: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300',
};

const valueColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
};

export default function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = 'blue',
    trend,
}: KPICardProps) {
    return (
        <div className={`rounded-xl border-2 p-6 ${colorClasses[color]} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer animate-slideIn`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg ${iconColorClasses[color]} transition-transform duration-300 hover:rotate-12`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>

            <div className="flex items-end justify-between">
                <h3 className={`text-4xl font-bold ${valueColorClasses[color]} transition-all duration-300`}>
                    {value}
                </h3>

                {trend && (
                    <div className={`text-sm font-semibold flex items-center gap-1 ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        <span className="animate-bounce">{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}
