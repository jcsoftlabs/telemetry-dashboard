// Telemetry API Types
export interface TelemetryEventStats {
  total: number;
  byType: Array<{
    eventType: string;
    count: number;
  }>;
}

export interface PerformanceStats {
  averageResponseTime: number;
  averageTTFB: number;
  maxResponseTime: number;
  minResponseTime: number;
  recentMetrics: ApiMetric[];
}

export interface ApiMetric {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ttfb: number | null;
  createdAt: string;
}

export interface ErrorStats {
  total: number;
  bySeverity: Array<{
    severity: string;
    count: number;
  }>;
  byType: Array<{
    errorType: string;
    count: number;
  }>;
}

export interface SessionStats {
  totalSessions: number;
  averageDuration: number;
  averagePageviews: number;
  averageEvents: number;
  topCountries: Array<{
    country: string;
    count: number;
  }>;
}

export interface OverviewStats {
  events: TelemetryEventStats;
  performance: PerformanceStats;
  errors: ErrorStats;
  sessions: SessionStats;
  timestamp: string;
}

export interface GeoStats {
  byCountry: Array<{
    country: string;
    sessions: number;
    percentage: string;
    avgDuration: number;
    avgPageviews: number;
    avgEvents: number;
  }>;
  byCity: Array<{
    city: string;
    country: string;
    sessions: number;
  }>;
  gpsLocations: Array<{
    country: string;
    count: number;
  }>;
  totalSessions: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'PARTNER';
  firstName?: string;
  lastName?: string;
}

export interface PageStats {
  totalPageviews: number;
  averageTimeOnPage: number;
  averageLoadTime: number;
  topPages: Array<{
    path: string;
    views: number;
    avgTimeOnPage: number;
  }>;
}

export interface DeviceStats {
  total: number;
  byDeviceType: Array<{
    deviceType: string;
    count: number;
    percentage: number;
  }>;
  byOS: Array<{
    os: string;
    count: number;
    percentage: number;
  }>;
  byBrowser: Array<{
    browser: string;
    count: number;
    percentage: number;
  }>;
}
