import { useSession } from 'next-auth/react';
import { usePolling } from './usePolling';
import { getOverviewStats } from '@/lib/api/telemetry';
import type { OverviewStats } from '@/types/telemetry';

/**
 * Hook to fetch telemetry overview statistics with polling
 */
export function useTelemetryOverview(pollingInterval: number = 5000) {
    const { data: session } = useSession();

    const fetchData = async (): Promise<OverviewStats> => {
        if (!session?.accessToken) {
            throw new Error('No authentication token available');
        }

        return await getOverviewStats(session.accessToken);
    };

    return usePolling<OverviewStats>(fetchData, pollingInterval, !!session?.accessToken);
}
