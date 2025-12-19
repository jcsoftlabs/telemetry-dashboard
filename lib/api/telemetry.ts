import { apiClient } from './client';
import type {
    ApiResponse,
    OverviewStats,
    GeoStats,
    ErrorStats,
    TelemetryEventStats,
    PerformanceStats,
    SessionStats,
    PageStats,
    DeviceStats,
} from '@/types/telemetry';

/**
 * Telemetry API functions
 */

export async function getOverviewStats(
    token: string,
    startDate?: string,
    endDate?: string
): Promise<OverviewStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/overview${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<OverviewStats>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch overview stats');
    }

    return response.data;
}

export async function getGeoStats(
    token: string,
    startDate?: string,
    endDate?: string
): Promise<GeoStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/geo${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<GeoStats>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch geo stats');
    }

    return response.data;
}

export async function getErrorStats(
    token: string,
    startDate?: string,
    endDate?: string,
    errorType?: string,
    severity?: string
): Promise<ErrorStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (errorType) params.append('errorType', errorType);
    if (severity) params.append('severity', severity);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/errors${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<ErrorStats>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch error stats');
    }

    return response.data;
}

export async function getEventStats(
    token: string,
    startDate?: string,
    endDate?: string,
    userId?: string,
    eventType?: string
): Promise<TelemetryEventStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (userId) params.append('userId', userId);
    if (eventType) params.append('eventType', eventType);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/events${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<TelemetryEventStats>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch event stats');
    }

    return response.data;
}

export async function getPerformanceStats(
    token: string,
    startDate?: string,
    endDate?: string,
    endpoint?: string,
    statusCode?: number
): Promise<PerformanceStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (endpoint) params.append('endpoint', endpoint);
    if (statusCode) params.append('statusCode', statusCode.toString());

    const queryString = params.toString();
    const apiEndpoint = `/api/telemetry/stats/performance${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<PerformanceStats>>(apiEndpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch performance stats');
    }

    return response.data;
}

export async function getSessionStats(
    token: string,
    startDate?: string,
    endDate?: string
): Promise<SessionStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/sessions${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<SessionStats>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch session stats');
    }

    return response.data;
}

/**
 * Get page view statistics
 */
export async function getPageStats(
    token: string,
    startDate?: string,
    endDate?: string,
    userId?: string,
    path?: string
): Promise<PageStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (userId) params.append('userId', userId);
    if (path) params.append('path', path);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/pages${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<PageStats>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch page stats');
    }

    return response.data;
}

/**
 * Get device statistics
 */
export async function getDeviceStats(
    token: string,
    startDate?: string,
    endDate?: string,
    deviceType?: string,
    os?: string
): Promise<DeviceStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (deviceType) params.append('deviceType', deviceType);
    if (os) params.append('os', os);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/devices${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<DeviceStats>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch device stats');
    }

    return response.data;
}

/**
 * Get navigation path analytics
 */
export async function getNavigationPaths(
    token: string,
    startDate?: string,
    endDate?: string,
    limit?: number
): Promise<Array<{ path: string; users: number; conversions: number; rate: number }>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/navigation-paths${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<Array<{ path: string; users: number; conversions: number; rate: number }>>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch navigation paths');
    }

    return response.data;
}

/**
 * Get conversion funnel analytics
 */
export async function getConversionFunnel(
    token: string,
    startDate?: string,
    endDate?: string
): Promise<Array<{ step: string; users: number; dropoff: number }>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const endpoint = `/api/telemetry/stats/conversion-funnel${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient<ApiResponse<Array<{ step: string; users: number; dropoff: number }>>>(endpoint, { token });

    if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch conversion funnel');
    }

    return response.data;
}
