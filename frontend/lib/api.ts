// Backend API client for SaralGST

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface LookupRequest {
  query: string;
  query_type?: 'auto' | 'hsn' | 'product_name';
  language?: 'en' | 'hi';
}

export interface LookupResponse {
  hsn_code: string;
  description: string;
  description_hi?: string;
  category: string;
  old_rate: number;
  new_rate: number;
  rate_changed: boolean;
  movement: 'up' | 'down' | 'unchanged' | 'new_exempt';
  notification_ref: string;
  notes?: string;
  confidence: number;
  interpreted_from: string;
  warning?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  upgrade_url?: string;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['X-Session-Token'] = this.token;
    }

    return headers;
  }

  async lookup(request: LookupRequest): Promise<LookupResponse> {
    const response = await fetch(`${this.baseUrl}/api/lookup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Lookup failed');
    }

    return response.json();
  }

  async validateKey(token: string): Promise<{
    valid: boolean;
    tier: 'free' | 'paid' | 'ca_firm';
    expires_at?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/validate-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    return response.json();
  }

  async healthCheck(): Promise<{
    status: string;
    version: string;
    data_version: string;
  }> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }
}

// Singleton instance
export const apiClient = new ApiClient();
