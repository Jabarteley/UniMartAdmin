import { apiCall } from '../utils/api';

// User API service
export const usersAPI = {
  // Get all users with filters
  getUsers: async (filters: any = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.verified) params.append('verified', filters.verified);
    if (filters.status) params.append('status', filters.status);
    if (filters.role) params.append('role', filters.role);
    if (filters.campus) params.append('campus', filters.campus);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const response = await apiCall(`/admin/users${queryString ? '?' + queryString : ''}`);

    if (!response) return null;
    return await response.json();
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await apiCall(`/admin/users/${id}`);
    if (!response) return null;
    return await response.json();
  },

  // Update user status (suspend, warn, ban, downgrade seller role)
  updateUserStatus: async (id: string, status: string, reason?: string, duration?: string, newRole?: string, newSellerType?: string) => {
    const response = await apiCall(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        reason,
        duration,
        newRole,
        newSellerType
      }),
    });

    if (!response) return null;
    return await response.json();
  },

  // Get user's deals history
  getUserDeals: async (id: string) => {
    const response = await apiCall(`/admin/users/${id}/deals`);
    if (!response) return null;
    return await response.json();
  },

  // Get user's chats
  getUserChats: async (id: string) => {
    const response = await apiCall(`/admin/users/${id}/chats`);
    if (!response) return null;
    return await response.json();
  },

  // Get user's ratings
  getUserRatings: async (id: string) => {
    const response = await apiCall(`/admin/users/${id}/ratings`);
    if (!response) return null;
    return await response.json();
  },
};