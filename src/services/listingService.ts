import { apiCall } from '../utils/api';

// Listings API service
export const listingsAPI = {
  // Get all listings with filters
  getListings: async (filters: any = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.campus) params.append('campus', filters.campus);
    if (filters.reports) params.append('reports', filters.reports);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const response = await apiCall(`/admin/listings${queryString ? '?' + queryString : ''}`);

    if (!response) return null;
    return await response.json();
  },

  // Update listing status
  updateListingStatus: async (id: string, status: string, reason?: string) => {
    const response = await apiCall(`/admin/listings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });

    if (!response) return null;
    return await response.json();
  },

  // Get all categories
  getCategories: async () => {
    const response = await apiCall('/admin/categories');
    if (!response) return null;
    return await response.json();
  },

  // Update category settings
  updateCategory: async (name: string, updates: any) => {
    const response = await apiCall(`/admin/categories/${name}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (!response) return null;
    return await response.json();
  },

  // Create new category
  createCategory: async (category: any) => {
    const response = await apiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });

    if (!response) return null;
    return await response.json();
  },
};