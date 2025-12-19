import { apiCall } from '../utils/api';

// Settings API service
export const settingsAPI = {
  // Get general settings
  getGeneralSettings: async () => {
    const response = await apiCall('/admin/settings/general');
    if (!response) return null;
    return await response.json();
  },
  
  // Update general settings
  updateGeneralSettings: async (settings: any) => {
    const response = await apiCall('/admin/settings/general', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get deal settings
  getDealSettings: async () => {
    const response = await apiCall('/admin/settings/deals');
    if (!response) return null;
    return await response.json();
  },
  
  // Update deal settings
  updateDealSettings: async (settings: any) => {
    const response = await apiCall('/admin/settings/deals', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get verification settings
  getVerificationSettings: async () => {
    const response = await apiCall('/admin/settings/verification');
    if (!response) return null;
    return await response.json();
  },
  
  // Update verification settings
  updateVerificationSettings: async (settings: any) => {
    const response = await apiCall('/admin/settings/verification', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get notification settings
  getNotificationSettings: async () => {
    const response = await apiCall('/admin/settings/notifications');
    if (!response) return null;
    return await response.json();
  },
  
  // Update notification settings
  updateNotificationSettings: async (settings: any) => {
    const response = await apiCall('/admin/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get all settings
  getAllSettings: async () => {
    const response = await apiCall('/admin/settings');
    if (!response) return null;
    return await response.json();
  },
  
  // Update all settings
  updateAllSettings: async (settings: any) => {
    const response = await apiCall('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    
    if (!response) return null;
    return await response.json();
  },
};