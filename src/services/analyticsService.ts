import { apiCall } from '../utils/api';

// Analytics API service
export const analyticsAPI = {
  // Get system analytics
  getSystemAnalytics: async () => {
    const response = await apiCall('/admin/analytics');
    if (!response) return null;
    return await response.json();
  },
  
  // Get user retention analytics
  getUserRetention: async () => {
    const response = await apiCall('/admin/analytics/retention');
    if (!response) return null;
    return await response.json();
  },
  
  // Export analytics data
  exportAnalytics: async (format: 'csv' | 'pdf') => {
    const response = await apiCall(`/admin/analytics/export?format=${format}`);
    if (!response) return null;
    
    if (format === 'csv') {
      const blob = await response.blob();
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unimart-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      // For PDF, we might want to open in a new tab
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      window.URL.revokeObjectURL(url);
    }
    
    return response;
  },
  
  // Get category performance analytics
  getCategoryPerformance: async () => {
    const response = await apiCall('/admin/analytics/categories');
    if (!response) return null;
    return await response.json();
  },
  
  // Get user activity analytics
  getUserActivity: async () => {
    const response = await apiCall('/admin/analytics/users/activity');
    if (!response) return null;
    return await response.json();
  },
  
  // Get deal conversion analytics
  getDealConversion: async () => {
    const response = await apiCall('/admin/analytics/deals/conversion');
    if (!response) return null;
    return await response.json();
  },
};