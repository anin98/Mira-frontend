
const API_BASE_URL = "https://api.grayscale-technologies.com/api";

export interface Order {
  id: number;
  created_at: string;
  updated_at: string;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  status: string;
  customer: any; // nullable
  company: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  };
  items: Array<{
    id: number;
    // add other item properties as needed
  }>;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

export interface Conversation {
  id: string;
  customer_name?: string;
  last_message?: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'active';
  unread_count?: number;
}

export interface AnalyticsSummary {
  total_orders: number;
  total_revenue: number;
  unique_customers: number;
  avg_order_value: number;
  total_quantity: number;
  recent_orders: number;
}

export interface AIConfig {
  assistant_name?: string;
  personality?: string;
  greeting_message?: string;
  business_info?: string;
  custom_instructions?: string;
}

class ApiService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard Analytics
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return this.fetchWithAuth('/dashboard/analytics-summary/');
  }

  // Orders
  async getOrders(): Promise<{ orders: Order[]; total: number }> {
    const response = await this.fetchWithAuth('/dashboard/orders/');
    console.log('Raw API response:', response); // Add this for debugging
    
    // Your API seems to return the orders array directly, not nested in 'results'
    return {
      orders: response || [], // Try this instead of response.results
      total: response?.length || 0
    };
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await this.fetchWithAuth('/dashboard/products/');
    return response.results || response.products || [];
  }

  // Conversations
  async getInbox(): Promise<Conversation[]> {
    const response = await this.fetchWithAuth('/dashboard/inbox/');
    return response.results || response.conversations || [];
  }

  async getConversationDetails(id: string): Promise<any> {
    return this.fetchWithAuth(`/dashboard/${id}/conversation/`);
  }

  // AI Configuration
  async getAIConfig(): Promise<AIConfig> {
    return this.fetchWithAuth('/dashboard/ai-config/');
  }

  async updateAIConfig(config: Partial<AIConfig>): Promise<AIConfig> {
    return this.fetchWithAuth('/dashboard/ai-config/', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }
}

export const apiService = new ApiService();