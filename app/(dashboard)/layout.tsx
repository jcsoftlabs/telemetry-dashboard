import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
    onExportCSV?: () => void;
    onExportPDF?: () => void;
}

export default function DashboardLayout({
    children,
    onExportCSV,
    onExportPDF,
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                <Header onExportCSV={onExportCSV} onExportPDF={onExportPDF} />

                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
