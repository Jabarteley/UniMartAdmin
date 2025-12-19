import { apiCall } from '../utils/api';

// Ratings API service
export const ratingsAPI = {
  // Get all reviews with filters
  getReviews: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/reviews${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Update a review status
  updateReview: async (id: string, status: string, reason?: string) => {
    const response = await apiCall(`/admin/reviews/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Remove a review
  removeReview: async (id: string, reason: string) => {
    const response = await apiCall(`/admin/reviews/${id}/remove`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Reset user trust score
  resetTrustScore: async (userId: string, reason: string) => {
    const response = await apiCall('/admin/users/trust-score/reset', {
      method: 'PUT',
      body: JSON.stringify({ userId, reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Update trust settings
  updateTrustSettings: async (settings: any) => {
    const response = await apiCall('/admin/settings/trust', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get trust settings
  getTrustSettings: async () => {
    const response = await apiCall('/admin/settings/trust');
    if (!response) return null;
    return await response.json();
  },
};