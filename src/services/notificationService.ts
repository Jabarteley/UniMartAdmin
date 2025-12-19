import { apiCall } from '../utils/api';

// Notification API service
export const notificationAPI = {
  // Get all notifications with filters
  getNotifications: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/notifications${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Create a new notification
  createNotification: async (notification: any) => {
    const response = await apiCall('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Update a notification
  updateNotification: async (id: string, updates: any) => {
    const response = await apiCall(`/admin/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Send a notification
  sendNotification: async (id: string) => {
    const response = await apiCall(`/admin/notifications/${id}/send`, {
      method: 'POST',
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get system settings
  getSystemSettings: async () => {
    const response = await apiCall('/admin/settings');
    if (!response) return null;
    return await response.json();
  },
  
  // Update system settings
  updateSystemSettings: async (settings: any) => {
    const response = await apiCall('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    
    if (!response) return null;
    return await response.json();
  },
};