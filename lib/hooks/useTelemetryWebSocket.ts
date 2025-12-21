'use client';

import { useWebSocket } from './useWebSocket';
import type { OverviewStats, GeoStats, DeviceStats, SessionStats, ErrorStats, PageStats, TelemetryEventStats } from '@/types/telemetry';

/**
 * Hook for real-time telemetry overview statistics
 */
export function useTelemetryOverview() {
    return useWebSocket<OverviewStats>('telemetry:overview');
}

/**
 * Hook for real-time geographic statistics
 */
export function useTelemetryGeo() {
    return useWebSocket<GeoStats>('telemetry:geo');
}

/**
 * Hook for real-time device statistics
 */
export function useTelemetryDevices() {
    return useWebSocket<DeviceStats>('telemetry:devices');
}

/**
 * Hook for real-time session statistics
 */
export function useTelemetrySessions() {
    return useWebSocket<SessionStats>('telemetry:sessions');
}

/**
 * Hook for real-time error statistics
 */
export function useTelemetryErrors() {
    return useWebSocket<ErrorStats>('telemetry:errors');
}

/**
 * Hook for real-time event statistics
 */
export function useTelemetryEvents() {
    return useWebSocket<TelemetryEventStats>('telemetry:events');
}

/**
 * Hook for real-time page view statistics  
 */
export function useTelemetryPages() {
    return useWebSocket<PageStats>('telemetry:pages');
}
