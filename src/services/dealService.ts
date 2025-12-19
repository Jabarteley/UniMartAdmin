import { apiCall } from '../utils/api';

// Deals API service
export const dealsAPI = {
  // Get all deals with filters
  getDeals: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/deals${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Update deal status
  updateDealAction: async (id: string, action: string, reason?: string, note?: string) => {
    const response = await apiCall(`/admin/deals/${id}/action`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason, note }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get deals analytics
  getDealsAnalytics: async () => {
    const response = await apiCall('/admin/deals/analytics');
    if (!response) return null;
    return await response.json();
  },
};