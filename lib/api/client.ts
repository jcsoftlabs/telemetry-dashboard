/**
 * HTTP client for API requests with authentication
 */

interface FetchOptions extends RequestInit {
    token?: string;
}

export async function apiClient& lt; T & gt; (
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { token, ...fetchOptions } = options;
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    // Add authorization header if token provided
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${baseURL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
        });

        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
            throw new Error('Unauthorized - Please log in again');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Client Error:', error);
        throw error;
    }
}
