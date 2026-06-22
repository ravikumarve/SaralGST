// Backend API client for SaralGST

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Matches backend models/lookup.py LookupResponse
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

export interface CalculationResponse {
  base_price: number;
  gst_rate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
}

export interface ExplanationResponse {
  item: string;
  rate: number;
  category: string;
  explanation: string;
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

  async lookup(query: string, queryType: string = 'auto', language: string = 'en'): Promise<LookupResponse> {
    const params = new URLSearchParams({ query, query_type: queryType, language });
    const response = await fetch(`${this.baseUrl}/api/v1/gst/lookup?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Lookup failed');
    }

    const data: LookupResponse = await response.json();

    // Fire-and-forget usage logging to SQLite
    fetch('/api/hq/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        hsnCode: data.hsn_code,
        resultRate: data.new_rate,
        success: true,
      }),
    }).catch(() => {});

    return data;
  }

  async explain(itemName: string): Promise<ExplanationResponse> {
    const params = new URLSearchParams({ item_name: itemName });
    const response = await fetch(`${this.baseUrl}/api/v1/gst/explain?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Explanation failed');
    }

    return response.json();
  }

  async calculate(basePrice: number, gstRate: number): Promise<CalculationResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/gst/calculate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ base_price: basePrice, gst_rate: gstRate }),
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.message || 'Calculation failed');
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
