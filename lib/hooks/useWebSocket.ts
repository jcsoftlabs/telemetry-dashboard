'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

/**
 * Generic WebSocket hook for real-time data updates
 * @template T - Type of data expected from the WebSocket event
 * @param event - WebSocket event name to listen to (e.g., 'telemetry:overview')
 * @param onData - Optional callback when data is received
 * @param enabled - Whether the WebSocket connection should be active
 * @returns Object with data, error, connection state, and reconnection state
 */
export function useWebSocket<T>(
    event: string,
    onData?: (data: T) => void,
    enabled: boolean = true
): {
    data: T | null;
    error: Error | null;
    connected: boolean;
    reconnecting: boolean;
    refetch: () => void;
} {
    const { data: session } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [connected, setConnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const onDataRef = useRef(onData);

    // Update ref when callback changes
    useEffect(() => {
        onDataRef.current = onData;
    }, [onData]);

    // Manual refetch function (though not needed with WebSocket, kept for compatibility)
    const refetch = useCallback(() => {
        // WebSocket push data automatically, but we can request if needed
        console.log('Refetch called on WebSocket hook (no-op for push updates)');
    }, []);

    useEffect(() => {
        if (!enabled || !session?.accessToken) {
            console.log(`WebSocket disabled or no auth token for event: ${event}`);
            return;
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

        console.log(`🔌 Initializing WebSocket connection to ${backendUrl} for event: ${event}`);

        const socketInstance = io(backendUrl, {
            auth: {
                token: session.accessToken
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000
        });

        // Connection events
        socketInstance.on('connect', () => {
            console.log(`✅ WebSocket connected to ${event}`);
            setConnected(true);
            setReconnecting(false);
            setError(null);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log(`❌ WebSocket disconnected from ${event} (${reason})`);
            setConnected(false);
        });

        socketInstance.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnecting to ${event}... attempt ${attemptNumber}`);
            setReconnecting(true);
        });

        socketInstance.on('reconnect', (attemptNumber) => {
            console.log(`✅ Reconnected to ${event} after ${attemptNumber} attempts`);
            setReconnecting(false);
            setConnected(true);
        });

        socketInstance.on('reconnect_failed', () => {
            console.error(`❌ Failed to reconnect to ${event}`);
            setReconnecting(false);
            setError(new Error('Failed to reconnect to WebSocket'));
        });

        // Data event
        socketInstance.on(event, (receivedData: T) => {
            console.log(`📨 Received data for ${event}`, receivedData);
            setData(receivedData);
            onDataRef.current?.(receivedData);
        });

        // Error event
        socketInstance.on('connect_error', (err: Error) => {
            console.error(`❌ WebSocket connection error for ${event}:`, err);
            setError(err);
        });

        socketInstance.on('error', (err: Error) => {
            console.error(`❌ WebSocket error for ${event}:`, err);
            setError(err);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            console.log(`🔌 Cleaning up WebSocket connection for ${event}`);
            socketInstance.disconnect();
        };
    }, [event, enabled, session?.accessToken]);

    return { data, error, connected, reconnecting, refetch };
}
