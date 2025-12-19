import { apiCall } from '../utils/api';

// Content Management System API service
export const cmsAPI = {
  // Get all banners
  getBanners: async () => {
    const response = await apiCall('/admin/content/banners');
    if (!response) return null;
    return await response.json();
  },
  
  // Get home page content
  getHomePageContent: async () => {
    const response = await apiCall('/admin/content/homepage');
    if (!response) return null;
    return await response.json();
  },
  
  // Get promotional messages
  getPromotions: async () => {
    const response = await apiCall('/admin/content/promotions');
    if (!response) return null;
    return await response.json();
  },
  
  // Create a new banner
  createBanner: async (banner: any) => {
    const response = await apiCall('/admin/content/banners', {
      method: 'POST',
      body: JSON.stringify(banner),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Update an existing banner
  updateBanner: async (id: string, updates: any) => {
    const response = await apiCall(`/admin/content/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Update home page content
  updateHomePageContent: async (section: string, content: any) => {
    const response = await apiCall(`/admin/content/homepage/${section}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Create or update promotional message
  updatePromotion: async (id: string, promotion: any) => {
    const response = await apiCall(`/admin/content/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotion),
    });
    
    if (!response) return null;
    return await response.json();
  },
};