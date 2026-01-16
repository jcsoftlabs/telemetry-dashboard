'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Clock, Calendar, Lock } from 'lucide-react';

export default function MaintenancePage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Date de livraison prévue - MODIFIE CETTE DATE
    const deliveryDate = new Date('2026-01-31T00:00:00');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = deliveryDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop"
                    alt="Haiti Landscape"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="relative z-20 flex flex-col justify-between p-12 text-white w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            TI
                        </div>
                        <div>
                            <div className="text-sm font-semibold uppercase tracking-wide">Tourism Intelligence Unit</div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-5xl font-bold mb-4">
                            Système en Développement
                        </h1>
                        <p className="text-xl text-gray-300 max-w-xl">
                            Le tableau de bord de télémétrie est actuellement en phase de développement et de tests finaux.
                        </p>
                    </div>

                    <div className="text-sm text-gray-400">
                        © 2025 Ministry of Tourism Haiti. All rights reserved.<br />
                        System Version 2.4.0
                    </div>
                </div>
            </div>

            {/* Right side - Countdown */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
                <div className="w-full max-w-md text-center">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Système Non Disponible
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Le système sera disponible à la date de livraison prévue
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex items-center justify-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                            <Calendar className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                Livraison prévue: {deliveryDate.toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {timeLeft.days}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Jours</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {timeLeft.hours}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Heures</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {timeLeft.minutes}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Minutes</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4">
                                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {timeLeft.seconds}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Secondes</div>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Développement en Cours
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Notre équipe travaille activement sur les derniers tests et optimisations
                                    pour vous offrir la meilleure expérience possible.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            Pour toute question concernant la livraison, veuillez contacter{' '}
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                JC Soft Labs
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
