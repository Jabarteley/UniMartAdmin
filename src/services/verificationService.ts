import { apiCall } from '../utils/api';

// Verification API service
export const verificationAPI = {
  // Get verification requests with filters
  getVerificationRequests: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/verifications${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Update verification status
  updateVerificationStatus: async (id: string, status: string, reason?: string) => {
    const response = await apiCall(`/admin/verifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get verification analytics
  getVerificationAnalytics: async () => {
    const response = await apiCall('/admin/verifications/analytics');
    if (!response) return null;
    return await response.json();
  },
};