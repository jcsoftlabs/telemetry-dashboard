import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64 min-w-0 overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
