import { useAuth } from '../context/AuthContext';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Generic API call function
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(includeAuth && { 'x-auth-token': localStorage.getItem('adminToken') || '' }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/login';
    return null;
  }

  return response;
};

// Authentication API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
    
    return response ? response.json() : null;
  },

  getMe: async () => {
    const response = await apiCall('/admin/me');
    return response ? response.json() : null;
  },
};

// Users API functions
export const usersAPI = {
  getUsers: async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiCall(`/admin/users${params ? '?' + params : ''}`);
    return response ? response.json() : null;
  },
  
  getUserById: async (id: string) => {
    const response = await apiCall(`/admin/users/${id}`);
    return response ? response.json() : null;
  },
  
  updateUserStatus: async (id: string, status: string, suspensionDuration?: string) => {
    const response = await apiCall(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, suspensionDuration }),
    });
    return response ? response.json() : null;
  },
};

// Listings API functions
export const listingsAPI = {
  getListings: async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiCall(`/admin/listings${params ? '?' + params : ''}`);
    return response ? response.json() : null;
  },
  
  updateListingStatus: async (id: string, status: string) => {
    const response = await apiCall(`/admin/listings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response ? response.json() : null;
  },
  
  getCategories: async () => {
    const response = await apiCall('/admin/categories');
    return response ? response.json() : null;
  },
  
  updateCategory: async (name: string, updates: any) => {
    const response = await apiCall(`/admin/categories/${name}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response ? response.json() : null;
  },
  
  createCategory: async (category: any) => {
    const response = await apiCall('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    return response ? response.json() : null;
  },
};

// Deals API functions
export const dealsAPI = {
  getDeals: async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiCall(`/admin/deals${params ? '?' + params : ''}`);
    return response ? response.json() : null;
  },
  
  updateDealAction: async (id: string, action: string) => {
    const response = await apiCall(`/admin/deals/${id}/action`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
    return response ? response.json() : null;
  },
};

// Reports API functions
export const reportsAPI = {
  getReports: async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiCall(`/admin/reports${params ? '?' + params : ''}`);
    return response ? response.json() : null;
  },
  
  resolveReport: async (id: string, action: string, note: string, targets: any[]) => {
    const response = await apiCall(`/admin/reports/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ action, note, targets }),
    });
    return response ? response.json() : null;
  },
};

// Verification API functions
export const verificationAPI = {
  getVerificationRequests: async (filters: any = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiCall(`/admin/verifications${params ? '?' + params : ''}`);
    return response ? response.json() : null;
  },
  
  updateVerificationStatus: async (id: string, status: string, reason?: string) => {
    const response = await apiCall(`/admin/verifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
    return response ? response.json() : null;
  },
};

// Analytics API functions
export const analyticsAPI = {
  getSystemAnalytics: async () => {
    const response = await apiCall('/admin/analytics');
    return response ? response.json() : null;
  },
  
  getUserRetention: async () => {
    const response = await apiCall('/admin/analytics/retention');
    return response ? response.json() : null;
  },
  
  exportAnalytics: async () => {
    const response = await apiCall('/admin/analytics/export');
    return response ? response.blob() : null;
  },
};