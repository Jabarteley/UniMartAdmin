import { apiCall } from '../utils/api';

// Reports API service
export const reportsAPI = {
  // Get all reports with filters
  getReports: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/reports${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Resolve a report
  resolveReport: async (id: string, action: string, note: string, targets: any[]) => {
    const response = await apiCall(`/admin/reports/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ action, note, targets }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get reported messages
  getReportedMessages: async () => {
    const response = await apiCall('/admin/messages/reported');
    if (!response) return null;
    return await response.json();
  },
  
  // Flag a user
  flagUser: async (userId: string, reason: string) => {
    const response = await apiCall('/admin/reports/users/flag', {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
};