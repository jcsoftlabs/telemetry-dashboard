'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function usePolling<T>(
    fetchFn: () => Promise<T>,
    interval: number = 5000,
    enabled: boolean = true
): {
    data: T | null;
    error: Error | null;
    loading: boolean;
    refetch: () => Promise<void>;
} {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled) return;

        // Initial fetch
        refetch();

        // Set up polling
        const intervalId = setInterval(refetch, interval);

        return () => clearInterval(intervalId);
    }, [interval, enabled]);

    return { data, error, loading, refetch };
}
