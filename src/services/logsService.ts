import { apiCall } from '../utils/api';

// Logs API service
export const logsAPI = {
  // Get admin logs with filters
  getAdminLogs: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.action) params.append('action', filters.action);
    if (filters.admin) params.append('admin', filters.admin);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/logs${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get user activity logs
  getUserActivityLogs: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/logs/users${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get system activity logs
  getSystemActivityLogs: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/logs/system${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
};