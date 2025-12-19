'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else if (result?.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop"
                    alt="Haiti Landscape - Citadelle Laferrière"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Overlay Content */}
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
                            Préserver le Patrimoine par l&apos;Analyse de Données
                        </h1>
                        <p className="text-xl text-gray-300 max-w-xl">
                            Accès sécurisé au tableau de bord national de surveillance touristique. Surveillez les flux de visiteurs, analysez les tendances et protégez le patrimoine culturel d&apos;Haïti.
                        </p>

                        {/* Progress Dots */}
                        <div className="flex gap-2 mt-8">
                            <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                            <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                            <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400">
                        © 2024 Ministry of Tourism Haiti. All rights reserved.<br />
                        System Version 2.4.0
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Bienvenue
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Veuillez vous connecter pour accéder au tableau de bord.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Adresse Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@ministry.ht"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                />
                                <svg
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Se souvenir de moi</span>
                            </label>

                            <button
                                type="button"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Mot de passe oublié?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>

                    {/* Request Access */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Vous n&apos;avez pas de compte?{' '}
                            <button className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Demander un accès
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
