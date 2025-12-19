'use client';

import { useSession } from 'next-auth/react';
import { getOverviewStats } from '@/lib/api/telemetry';
import { usePolling } from './usePolling';
import type { OverviewStats } from '@/types/telemetry';

export function useTelemetryOverview(
    startDate?: string,
    endDate?: string,
    pollingInterval: number = 5000
) {
    const { data: session } = useSession();

    const fetchData = async () => {
        if (!session?.accessToken) {
            throw new Error('No access token available');
        }
        return getOverviewStats(session.accessToken, startDate, endDate);
    };

    return usePolling & lt; OverviewStats & gt; (fetchData, pollingInterval, !!session?.accessToken);
}
